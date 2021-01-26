import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { awsconfig } from "../aws-config";
import Review from "./Review";
import { v4 as uuid } from "uuid";
import { getTableName } from "../lib/dbLib";

const creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: awsconfig.identityPoolIds.main,
	RoleArn: awsconfig.arns.roles.dynamo
});

AWS.config.update({
	region: awsconfig.regions.main,
	credentials: creds
});

const db = new AWS.DynamoDB();
const dbdoc = new AWS.DynamoDB.DocumentClient();

const queryParams = {
	TableName: ""
};

export default function Reviews() {
	const [reviews, setReviews] = useState([]);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");

	useEffect(() => {
		getAllReviews("Review-");
		getUserList("User-");
	}, []);

	const convertIncomingDataArray = (dataItemsArray) => {
		const newDataItemsArray = dataItemsArray.map((item, _index) => {
			return {
				id: item.id.S,
				comment: item.comment.S,
				rating: item.rating.N,
				title: item.title.S,
				ownerId: item.ownerId.S,
				user: {
					id: item.user?.M.id.S,
					avatarUrl: item.user?.M.avatarUrl?.S,
					displayName: item.user?.M.displayName?.S
				}
			};
		});
		return newDataItemsArray;
	};

	const getUserList = async (searchFragment) => {
		const tableName = await getTableName(searchFragment, db);
		queryParams.TableName = tableName;

		dbdoc.scan(queryParams, (err, data) => {
			if (!err) {
				setUsers(data.Items);
			} else {
				console.error("DB Provider Unsuccessful ===> ", err);
			}
		});
	};

	const getAllReviews = async (searchFragment) => {
		const tableName = await getTableName(searchFragment, db);
		queryParams.TableName = tableName;

		db.scan(queryParams, (err, data) => {
			if (!err) {
				const newData = convertIncomingDataArray(data.Items);
				setReviews(newData);
			} else {
				console.error("DB Provider Unsuccessful ===> ", err);
			}
		});
	};

	const deleteReview = async (id) => {
		const tableName = await getTableName("Review", db);
		db.deleteItem(
			{
				TableName: tableName,
				Key: {
					id: {
						S: id
					}
				}
			},
			(err, _data) => {
				if (!err) {
					getAllReviews("Review-");
				} else {
					console.error("Delete review unsuccessful ==> ", err);
				}
			}
		);
	};

	const sendReviewToDynamo = async (reviewObject) => {
		const tableName = await getTableName("Review", db);
		const putParams = {
			TableName: tableName,
			Item: {
				id: {
					S: reviewObject.id
				},
				comment: {
					S: reviewObject.comment
				},
				title: {
					S: reviewObject.title
				},
				rating: {
					N: reviewObject.rating
				},
				ownerId: {
					S: reviewObject.ownerId
				},
				user: {
					M: {
						id: {
							S: reviewObject.user.id
						},
						displayName: {
							S: reviewObject.user.displayName
						},
						avatarUrl: {
							S: reviewObject.user.avatarUrl
						}
					}
				}
			}
		};

		db.putItem(putParams, (err, _data) => {
			if (!err) {
				getAllReviews("Review-");
			} else {
				console.error("Add review unsuccessful ==> ", err);
			}
		});
	};

	const addReview = (event) => {
		event.preventDefault();
		// TODO validation checks

		const userInfo = getUserInfo(event.target["displayName"].value);

		const reviewObject = {
			id: uuid(),
			title: event.target["title"].value,
			comment: event.target["comment"].value,
			rating: event.target["rating"].value,
			ownerId: userInfo.id,
			user: {
				id: userInfo.id,
				displayName: userInfo.displayName,
				avatarUrl: userInfo.avatarUrl
			}
		};

		sendReviewToDynamo(reviewObject);

		event.target["title"].value = "";
		event.target["comment"].value = "";
		event.target["rating"].value = null;
		event.target["displayName"].value = "";
	};

	const getUserInfo = (selectedUserName) => {
		return users.find((user) => user.displayName === selectedUserName);
	};

	const updateSelectedUser = (selectedValue) => {
		const newSelectedUser = getUserInfo(selectedValue);
		setSelectedUser(newSelectedUser);
	};

	return (
		<section className='p-5 w-full'>
			<h1>Reviews</h1>
			<div className='mt-5 flex flex-row w-full'>
				<div className='flex flex-col w-full max-w-xs'>
					<h3>Actions</h3>
					<div className='flex flex-row border rounded w-full'>
						<form
							className='flex flex-col'
							onSubmit={(event) => addReview(event)}
						>
							<div className='flex'>
								<label htmlFor='title'>Title</label>
								<input className='pl-5' name='title' id='title' type='text' />
							</div>
							<div className='flex'>
								<label htmlFor='comment'>Comment</label>
								<input
									className='pl-5'
									name='comment'
									id='comment'
									type='text'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='rating'>Rating</label>
								<input
									className='pl-5'
									name='rating'
									id='rating'
									type='number'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='owner'>Review Owner</label>
								<select
									className='pl-5'
									name='displayName'
									id='displayName'
									value={selectedUser}
									onChange={(e) => updateSelectedUser(e.target.value)}
								>
									{users.length > 0 &&
										users.map((user) => {
											return (
												<option key={user.id} value={user.displayName}>
													{user.displayName}
												</option>
											);
										})}
								</select>
							</div>
							<button type='submit' className='border-gray-200'>
								Add Review
							</button>
						</form>
					</div>
				</div>
				<div className='flex flex-col w-full ml-5'>
					<h3>Current Reviews</h3>
					<div className='flex flex-col border rounded'>
						{reviews &&
							reviews.map((review, id) => {
								return (
									<Review
										key={id}
										{...review}
										deleteReview={() => deleteReview(review.id)}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</section>
	);
}
