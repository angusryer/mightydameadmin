/* eslint-disable-line */
const aws = require("aws-sdk");
const syncToDynamo = require("./sync-dynamo");

exports.handler = async (event, context, callback) => {
	const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider(
		{ apiVersion: "2016-04-18" }
	);

	// Here, update the array to include the Admin emails you would like to use
	let adminEmails = [
			"fitness@mightydame.com",
			"admin@mightydame.com",
			"angus@ryer.ca"
		],
		isAdmin = false;

	if (adminEmails.indexOf(event.request.userAttributes.email) !== -1) {
		isAdmin = true;
	}

	if (isAdmin) {
		const groupParams = {
			GroupName: process.env.GROUP,
			UserPoolId: event.UserPoolId
		};

		const addUserParams = {
			...groupParams,
			Username: event.Username
		};

		try {
			await cognitoidentityserviceprovider.getGroup(groupParams).promise();
		} catch (e) {
			await cognitoidentityserviceprovider.createGroup(groupParams).promise();
		}

		try {
			await cognitoidentityserviceprovider
				.adminAddUserToGroup(addUserParams)
				.promise();
			syncToDynamo(event, context, (err, _success) => {
				if (err) return Error("Unable to sync admin user to DynamoBD");
			});
			context.done(null, event);
		} catch (e) {
			context.done(null, event);
		}
	} else {
		syncToDynamo(event, context, (err, _success) => {
			if (err) return Error("Unable to sync regular user to DynamoBD");
		});
		context.done(null, event);
	}
};
