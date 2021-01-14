import React, { useState, useEffect } from "react";
import AWS, { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { awsconfig } from "../aws-config";
import UserInfo from "./UserInfo";
import { ContextProvider } from "../context/context";
import { getTableName } from "../lib/dbLib";
import AddNewUser from "./AddNewUser";
import UpdateUser from "./UpdateUser";

const creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: awsconfig.identityPoolIds.main,
	RoleArn: awsconfig.arns.roles.dynamo
});

AWS.config.update({
	region: awsconfig.regions.main,
	credentials: creds
});

const db = new DynamoDB();
const dbdoc = new DynamoDB.DocumentClient();

const scanParams = {
	TableName: ""
};

export default function Users({ attributes: { sub } }) {
	const [numberOfUsers, setNumberOfUsers] = useState(0);
	const [registeredUsers, setRegisteredUsers] = useState([]);
	const [updateActive, setUpdateActive] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});

	useEffect(() => {
		getAllUsers("User-");
	}, []);

	const getAllUsers = async (searchFragment) => {
		const tableName = await getTableName(searchFragment, db);
		scanParams.TableName = tableName;
		dbdoc.scan(scanParams, (err, data) => {
			if (!err) {
				setRegisteredUsers(data.Items);
				setNumberOfUsers(data.ScannedCount);
			} else {
				console.error("DB Provider Unsuccessful ===> ", err);
			}
		});
	};

	const addNewUser = async (e) => {
		e.preventDefault();
		// check for email in cognito db
		// if present, then get all that info and place
		// it in putParams

		const table = await getTableName("User-", db);
		const putParams = {
			TableName: table,
			Item: {
				id: uuid(),
				firstName: e.target["firstName"].value,
				lastName: e.target["lastName"].value,
				displayName: e.target["displayName"].value,
				email: e.target["email"].value,
				userType: e.target["userType"].value,
				streetAddressOne: e.target["streetAddressOne"].value,
				streetAddressTwo: e.target["streetAddressTwo"].value,
				city: e.target["city"].value,
				provinceState: e.target["provinceState"].value,
				country: e.target["country"].value,
				postalZip: e.target["postalZip"].value,
				phone: e.target["phone"].value,
				isSubscribed: e.target["isSubscribed"].checked,
				avatarUrl: e.target["avatarUrl"].value
			}
		};

		dbdoc.put(putParams, (err, _data) => {
			if (!err) {
				getAllUsers("User-");
			} else {
				console.error("Add user unsuccessful ==> ", err);
			}
		});

		const credsCognito = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: awsconfig.identityPoolIds.main,
			RoleArn: awsconfig.arns.roles.cognito
		});

		AWS.config.update({
			region: awsconfig.regions.main,
			credentials: credsCognito,
			apiVersion: awsconfig.apiVersions.cognito
		});
	};

	const deleteUser = (userName) => {
		// userProvider.adminDeleteUser(
		// 	{ UserPoolId: awsconfig.userPoolIds.main, Username: userName },
		// 	(err, _data) => {
		// 		if (!err) {
		// 			getAllUsers();
		// 		} else {
		// 			console.error(
		// 				`User ${userName} was NOT deleted. An error occured ===> `,
		// 				err
		// 			);
		// 		}
		// 	}
		// );
	};

	const updateUser = (userId) => {
		const userSelected = registeredUsers.find((user) => user.id === userId);
		setSelectedUser(userSelected);
		setUpdateActive(true);
	};

	const confirmUpdateUser = (e) => {
		e.preventDefault();
		console.log(e.target);
	};

	const convertUserListData = (rawUserList) => {
		return rawUserList.map((user) => {
			return {
				name: user.Username,
				email: user.Attributes.find((attr) => attr.Name === "email").Value,
				sub: user.Attributes.find((attr) => attr.Name === "sub").Value,
				emailVerified:
					user.Attributes.find((attr) => attr.Name === "email_verified")
						.Value === "true"
						? "YES"
						: "NO",
				accountEnabled: user.Enabled ? "YES" : "NO",
				registeredOn: user.UserCreateDate.toDateString(),
				userStatus: user.UserStatus
			};
		});
	};

	const isOwner = (userId) => {
		return sub === userId;
	};

	// 	USER
	// 	id: ID!
	// 	firstName: String
	// 	lastName: String
	// 	displayName: String
	// 	email: String!
	// 	dateRegistered: AWSDateTime
	// 	userType: UserType!
	// 	streetAddressOne: String
	// 	streetAddressTwo: String
	// 	city: String
	// 	provinceState: String
	// 	country: String
	// 	postalZip: String
	// 	phone: String
	// 	isSubscribed: Boolean!
	// 	dateSubscribed: AWSDateTime
	// 	avatarUrl: String
	// 	reviews: [Review]! @connection(name: "UserReviewConnection")
	// 	offers: [EnrolledUsers] @connection(keyName: "byUser", fields: ["id"])

	return (
		<ContextProvider>
			<section className='p-5 w-full'>
				<h1 className='text-2xl mb-5'>Users</h1>
				<p className='mt-2 mb-3'>Number of registered users: {numberOfUsers}</p>
				<div className='flex flex-row mr-2 w-full'>
					<div className='flex flex-col w-full max-w-md'>
						{updateActive ? (
							<UpdateUser
								{...selectedUser}
								confirmUpdateUser={confirmUpdateUser}
							/>
						) : (
							<AddNewUser />
						)}
					</div>
					<div className='w-full min-w-xs'>
						{registeredUsers &&
							registeredUsers.map((user) => {
								return (
									<UserInfo
										key={user.id}
										{...user}
										deleteUser={() => deleteUser(user.displayName)}
										updateUser={() => updateUser(user.id)}
										owner={isOwner(user.id)}
									/>
								);
							})}
					</div>
				</div>
			</section>
		</ContextProvider>
	);
}
