import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { awsconfig } from "../aws-config";
import Review from "./Review";
import Button from "./Button";

const creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: awsconfig.identityPoolIds.main, //"ca-central-1:94d63211-9f29-4d48-8263-21e03c283d36",
	RoleArn: awsconfig.arns.roles.dynamo //"arn:aws:iam::378986558342:role/mdf_dynamopoweruser"
});

AWS.config.update({
	region: awsconfig.regions.main, //"ca-central-1",
	credentials: creds
});

const db = new AWS.DynamoDB();

const queryParams = {
	// ExpressionAttributeNames: {
	// 	"#AT": "AlbumTitle",
	// 	"#ST": "SongTitle"
	// },
	// ExpressionAttributeValues: {
	// 	":a": {
	// 		S: "No One You Know"
	// 	}
	// },
	// FilterExpression: "Artist = :a",
	// ProjectionExpression: "#ST, #AT",
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

	const getAllReviews = async (searchFragment) => {
		const tableName = await getTableName(searchFragment);
		queryParams.TableName = tableName;

		// TODO Remove in production
		// db.describeTable(queryParams, (err, data) => {
		// 	if (!err) {
		// 		console.log(data)
		// 	} else {
		// 		console.error("DB Provider Unsuccessful ===> ", err);
		// 	}
		// });

		db.scan(queryParams, (err, data) => {
			if (!err) {
				console.log(data) // TODO remove in prod
				setReviews(data.Items);
			} else {
				console.error("DB Provider Unsuccessful ===> ", err);
			}
		});
	};

	const sendReviewToDynamo = async (reviewObject) => {
		const tableName = await getTableName("Review")
		const putParams = {
			TableName: tableName,
			Item: {
				"title": {
					S: reviewObject.title
				},
				"comment": {
					S: reviewObject.comment
				},
				"rating": {
					N: reviewObject.rating
				},
				"user": {
					M: {
						"name": {
							S: reviewObject.user.name
						},
						"image": {
							S: reviewObject.user.image
						}
					}
				}
			}
		}
		db.putItem(putParams, (err, data) => {
			if (!err) {
				// const newReviewsList = {
				// 	...reviews,
				// }
				// setReviews(newReviewsList)
			} else {
				console.error("Add review unsuccessful ==> ", err)
			}
		})
	};

	const addReview = (event) => {
		event.preventDefault();
		// do validation checks
		const reviewObject = {
			user: {
				name: event.target["name"].value,
				image: event.target["image"].value
			},
			comment: event.target["comment"].value,
			rating: event.target["rating"].value,
			title: event.target["title"].value
		};

		sendReviewToDynamo(reviewObject);
		console.log("New review added:", reviewObject);
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
								<input
									className='pl-5'
									name='name'
									id='name'
									type='text'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='title'>Review Title</label>
								<input
									className='pl-5'
									name='title'
									id='title'
									type='text'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='image'>User Image</label>
								<input
									className='pl-5'
									name='image'
									id='image'
									type='texts'
								/>
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
								return <Review key={id} {...review} />;
							})}
					</div>
				</div>
			</div>
		</section>
	);
}
