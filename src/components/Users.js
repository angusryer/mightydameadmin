import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import {awsconfig} from "../aws-config";

const creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: awsconfig.identityPoolIds.main , //"ca-central-1:94d63211-9f29-4d48-8263-21e03c283d36",
	RoleArn:  awsconfig.arns.roles.cognito //"arn:aws:iam::378986558342:role/mdf_cognitopoweruser"
})

AWS.config.update({
	region: awsconfig.regions.main, //"ca-central-1",
	credentials: creds,
	apiVersion: awsconfig.apiVersions.cognito //"2016-04-18"
});

const userProvider = new AWS.CognitoIdentityServiceProvider();

export default function Users() {
	const [numberOfUsers, setNumberOfUsers] = useState(0);

	useEffect(() => {
		const getUserQuantity = async () => {
			await userProvider.describeUserPool(
				{ UserPoolId: awsconfig.userPoolIds.main }, //"ca-central-1_Fh59Vzag6"
				(err, data) => {
					if (err) {
						console.log("User Provider Unsuccessful ===> ", err);
					} else {
						setNumberOfUsers(data.UserPool.EstimatedNumberOfUsers);
					}
				}
			);
		};
		getUserQuantity();
	});

	return (
		<section className='p-5'>
			<h1 className='text-2xl mb-5'>Users</h1>
			<p>Number of user accounts created: {numberOfUsers}</p>
		</section>
	);
}
