import React, { useState, useEffect } from "react";
import AWS, { Config } from "aws-sdk";
import awsmobile from "../aws-exports";

const endpoint = new AWS.Endpoint(
	"https://cognito-idp.ca-central-1.amazonaws.com"
);

const cognitoConfig = {
	config: awsmobile,
	region: "ca-central-1",
	endpoint: endpoint,
	apiVersions: "2016-04-18"
};

const describeUserPoolConfig = {
	UserPoolId: "ca-central-1_Fh59Vzag6"
};

AWS.config.region = "ca-central-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: "ca-central-1:94d63211-9f29-4d48-8263-21e03c283d36",
	RoleArn: "arn:aws:iam::378986558342:role/mdf_cognitopoweruser"
});

export default function Users() {
	const [numberOfUsers, setNumberOfUsers] = useState(0);

	useEffect(() => {
		const getUserQuantity = async () => {
			const userProvider = new AWS.CognitoIdentityServiceProvider(
				cognitoConfig
			);
			let userPoolDescription = {};
			await userProvider.describeUserPool(
				describeUserPoolConfig,
				(err, data) => {
					if (err) {
						console.log("User Provider Unsuccessful ===> ", err);
					} else {
						setNumberOfUsers(data.UserPool.EstimatedNumberOfUsers);
						console.log(
							"User Pool Description Successful! ===> ",
							userPoolDescription
						);
					}
				}
			);
		};
		getUserQuantity();
	});

	return (
		<section>
			<h1>Users</h1>
			<p>Number of user accounts created: {numberOfUsers}</p>
		</section>
	);
}
