const aws = require("aws-sdk");
const uuid = require("uuid");
const ddb = new aws.DynamoDB({ apiVersion: "2012-10-08" });

module.exports = async (event, context, callback) => {
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
			UpdateExpression: "SET #a = :r, #b = :r",
			ExpressionAttributeNames: {
				"#a": "cognitoId",
				"#b": "dateRegistered"
			},
			ExpressionAttributeValues: {
				":r": event.request.userAttributes.sub,
				":d": date.toISOString()
			}
		};

		const addUserParams = {
			TableName: tableName,
			Item: {
				id: { S: uuid.v1() },
				cognitoId: { S: event.request.userAttributes.sub },
				firstName: { S: "" },
				lastName: { S: "" },
				displayName: { S: event.userName },
				email: { S: event.request.userAttributes.email },
				dateRegistered: { S: date.toISOString() },
				userType: { S: "MEMBER" },
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
						if (err) return callback(err);
					})
					.promise();
				console.log("DB UPDATE ==> ", event);
				callback(null, event);
			} else {
				await ddb
					.putItem(addUserParams, (err, _data) => {
						if (err) return callback(err);
					})
					.promise();
				console.log("DB ADD ==> ", event);

				callback(null, event);
			}
		} catch (err) {
			callback(err);
		}
	}
	console.log("END OF FUNCTION ==> ", event);

	callback(null, event);
};
