import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { awsconfig } from "../aws-config";

const creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: awsconfig.identityPoolIds.main,
	RoleArn: awsconfig.arns.roles.dynamo
});

AWS.config.update({
	region: awsconfig.regions.main,
	credentials: creds,
	apiVersion: awsconfig.apiVersions.dynamo
});

export default function Subscriptions() {
    const [subscribedUsers, setSubscribedUsers] = useState([])

    useEffect(() => {
        
    }, [])

	return (
		<section>
			<h1>Subscriptions</h1>
		</section>
	);
}
