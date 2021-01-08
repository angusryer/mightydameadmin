import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { awsconfig } from "../aws-config";
import UserInfo from "./UserInfo";
import { ContextProvider } from "../context/context";

const creds = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: awsconfig.identityPoolIds.main,
	RoleArn: awsconfig.arns.roles.cognito
});

AWS.config.update({
	region: awsconfig.regions.main,
	credentials: creds,
	apiVersion: awsconfig.apiVersions.cognito
});

const userProvider = new AWS.CognitoIdentityServiceProvider();

export default function Users({ attributes: { sub } }) {
	const [numberOfUsers, setNumberOfUsers] = useState(0);
	const [registeredUsers, setRegisteredUsers] = useState([]);

	const getUserQuantity = async () => {
		await userProvider.describeUserPool(
			{ UserPoolId: awsconfig.userPoolIds.main },
			(err, data) => {
				if (!err) {
					setNumberOfUsers(data.UserPool.EstimatedNumberOfUsers);
				} else {
					console.error("User Provider Unsuccessful ===> ", err);
				}
			}
		);
	};

	const getAllUsers = async () => {
		await userProvider.listUsers(
			{ UserPoolId: awsconfig.userPoolIds.main },
			(err, data) => {
				if (!err) {
					const simpleUserList = convertUserListData(data.Users);
					setRegisteredUsers(simpleUserList);
				} else {
					console.error("User Provider Unsuccessful ===> ", err);
				}
			}
		);
	};

	const addNewUser = (userParams) => {};

	const deleteUser = (userName) => {
		userProvider.adminDeleteUser(
			{ UserPoolId: awsconfig.userPoolIds.main, Username: userName },
			(err, _data) => {
				if (!err) {
					getAllUsers()
				} else {
					console.error(
						`User ${userName} was NOT deleted. An error occured ===> `,
						err
					);
				}
			}
		);
	};

	const convertUserListData = (rawUserList) => {
		return rawUserList.map((user) => {
			return {
				name: user.Username,
				email: user.Attributes.find((attr) => attr.Name === "email").Value,
				subId: user.Attributes.find((attr) => attr.Name === "sub").Value,
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

	useEffect(() => {
		getUserQuantity();
		getAllUsers();
	}, []);

	return (
		<ContextProvider>
			<section className='p-5 w-full'>
				<h1 className='text-2xl mb-5'>Users</h1>
				<p className='mt-2 mb-3'>Number of registered users: {numberOfUsers}</p>
				<div className='w-full min-w-xs'>
					{registeredUsers &&
						registeredUsers.map((user) => {
							return (
								<UserInfo
									key={user.subId}
									{...user}
									deleteUser={() => deleteUser(user.name)}
									owner={isOwner(user.subId)}
								/>
							);
						})}
				</div>
			</section>
		</ContextProvider>
	);
}
