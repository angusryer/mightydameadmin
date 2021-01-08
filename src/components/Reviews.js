import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { awsconfig } from "../aws-config";
import Review from "./Review";
import { v4 as uuid } from "uuid";

const creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: awsconfig.identityPoolIds.main,
	RoleArn: awsconfig.arns.roles.dynamo
});

AWS.config.update({
	region: awsconfig.regions.main,
	credentials: creds
});

const db = new AWS.DynamoDB();

const queryParams = {
	TableName: ""
};

export default function Reviews() {
	const [reviews, setReviews] = useState([]);

	useEffect(() => {
		getAllReviews("Review");
	}, []);

	const getTableName = (stringFragment) => {
		return new Promise((resolve, reject) => {
			db.listTables((err, data) => {
				let table = "";
				if (!err) {
					table = data.TableNames.find((table) => {
						return table.includes(stringFragment);
					});
					resolve(table);
				} else {
					console.log("listTables error ===> ", err);
					reject();
				}
			});
		});
	};

	const convertIncomingDataArray = (dataItemsArray) => {
		const newDataItemsArray = dataItemsArray.map((item, _index) => {
			return {
				id: item.id.S,
				comment: item.comment.S,
				rating: item.rating.N,
				title: item.title.S,
				user: {
					name: item.user.M.name.S,
					image: item.user.M.image.S
				}
			};
		});
		return newDataItemsArray;
	};

	const getAllReviews = async (searchFragment) => {
		const tableName = await getTableName(searchFragment);
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
		const tableName = await getTableName("Review");
		console.log("Deleting review ==> ", id, "from table ", tableName);
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
					getAllReviews("Review");
				} else {
					console.error("Delete review unsuccessful ==> ", err);
				}
			}
		);
	};

	const sendReviewToDynamo = async (reviewObject) => {
		const tableName = await getTableName("Review");
		const putParams = {
			TableName: tableName,
			Item: {
				id: {
					S: reviewObject.id
				},
				title: {
					S: reviewObject.title
				},
				comment: {
					S: reviewObject.comment
				},
				rating: {
					N: reviewObject.rating
				},
				user: {
					M: {
						name: {
							S: reviewObject.user.name
						},
						image: {
							S: reviewObject.user.image
						}
					}
				}
			}
		};
		db.putItem(putParams, (err, _data) => {
			if (!err) {
				getAllReviews("Review");
			} else {
				console.error("Add review unsuccessful ==> ", err);
			}
		});
	};

	const addReview = (event) => {
		event.preventDefault();
		// TODO validation checks
		const reviewObject = {
			id: uuid(),
			user: {
				name: event.target["name"].value,
				image: event.target["image"].value
			},
			comment: event.target["comment"].value,
			rating: event.target["rating"].value,
			title: event.target["title"].value
		};

		sendReviewToDynamo(reviewObject);

		event.target["name"].value = "";
		event.target["image"].value = "";
		event.target["comment"].value = "";
		event.target["rating"].value = null;
		event.target["title"].value = "";
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
								<label htmlFor='rating'>Rating</label>
								<input
									className='pl-5'
									name='rating'
									id='rating'
									type='number'
								/>
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
								<label htmlFor='name'>Username</label>
								<input className='pl-5' name='name' id='name' type='text' />
							</div>
							<div className='flex'>
								<label htmlFor='title'>Review Title</label>
								<input className='pl-5' name='title' id='title' type='text' />
							</div>
							<div className='flex'>
								<label htmlFor='image'>User Image</label>
								<input className='pl-5' name='image' id='image' type='text' />
							</div>
							<button type='submit'>Add Review</button>
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
