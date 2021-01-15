const aws = require("aws-sdk");
const uuid = require("uuid");
const utilities = require("./utilityLib");
const ddb = new aws.DynamoDB({ apiVersion: "2012-10-08" });

module.exports = async (event, context, callback, isAdmin) => {
	let date = new Date();
	const tableName = process.env.TABLE_NAME;
	const region = process.env.REGION;
	aws.config.update({ region: region });

	if (event.request.userAttributes.sub) {
		let existingUser = null;

		const scanParams = {
			TableName: tableName
		};

		let updateUserParams = {
			TableName: tableName,
			Key: {
				id: {
					S: null
				}
			},
			UpdateExpression:
				"SET #cognitoId = :subId, #date = :date, #userType = :userType, #userName = :userName",
			ExpressionAttributeNames: {
				"#cognitoId": "cognitoId",
				"#date": "dateRegistered",
				"#userType": "userType",
				userName: "userName"
			},
			ExpressionAttributeValues: {
				":subId": event.request.userAttributes.sub,
				":date": utilities.getFormattedDate(new Date()),
				":userType": isAdmin ? "ADMIN" : "MEMBER",
				":userName": event.userName
			}
		};

		const addUserParams = {
			TableName: tableName,
			Item: {
				id: { S: uuid.v1() },
				cognitoId: { S: event.request.userAttributes.sub },
				firstName: { S: "" },
				lastName: { S: "" },
				displayName: { S: "" },
				userName: { S: event.userName },
				email: { S: event.request.userAttributes.email },
				dateRegistered: { S: date.toISOString() },
				userType: { S: isAdmin ? "ADMIN" : "MEMBER" },
				streetAddressOne: { S: "" },
				streetAddressTwo: { S: "" },
				city: { S: "" },
				provinceState: { S: "" },
				country: { S: "" },
				postalZip: { S: "" },
				phone: { S: "" },
				isSubscribed: { BOOL: false },
				dateSubscribed: { S: "" },
				avatarUrl: { S: "" }
			}
		};

		await ddb
			.scan(scanParams, (err, data) => {
				if (!err) {
					existingUser = data.Items.find((user) => {
						return user.email === event.request.userAttributes.email;
					});
				} else {
					callback(err);
				}
			})
			.promise();

		try {
			if (existingUser) {
				updateUserParams.Key.id.S = existingUser.id;
				await ddb
					.update(updateUserParams, (err, _data) => {
						if (err) {
							callback(err);
						}
					})
					.promise();
				callback(null, event);
			} else {
				await ddb
					.putItem(addUserParams, (err, _data) => {
						if (err) {
							callback(err);
						}
					})
					.promise();
				callback(null, event);
			}
		} catch (err) {
			callback(err);
		}
	}
	callback(null, event);
};
