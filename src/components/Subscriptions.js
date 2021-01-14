import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { awsconfig } from "../aws-config";
import Subscriber from "./Subscriber";
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

const scanParams = {
	TableName: ""
};

export default function Subscriptions() {
	const [subscriptions, setSubscriptions] = useState([]);

	useEffect(() => {
		getAllSubscriptions("User-");
	}, []);

	const getAllSubscriptions = async (searchFragment) => {
		const tableName = await getTableName(searchFragment, db);
		scanParams.TableName = tableName;
		dbdoc.scan(scanParams, (err, data) => {
			if (!err) {
				const filteredItems = data.Items.filter((item) => {
					return item.isSubscribed;
				});
				setSubscriptions(filteredItems);
			} else {
				console.error("DB Provider Unsuccessful ===> ", err);
			}
		});
	};

	return (
		<section className='p-5 w-full'>
			<h1>Subscriptions</h1>
			<div className='mt-5 flex flex-row w-full'>
				<div className='flex flex-col w-full ml-5'>
					<h3>Current Subscribers</h3>
					<div className='flex flex-col border rounded'>
						{subscriptions &&
							subscriptions.map((subscriber, id) => {
								return <Subscriber key={id} {...subscriber} />;
							})}
					</div>
				</div>
			</div>
		</section>
	);
}
