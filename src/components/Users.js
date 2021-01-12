import React, { useState, useEffect } from "react";
import AWS, { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { awsconfig } from "../aws-config";
import UserInfo from "./UserInfo";
import { ContextProvider } from "../context/context";
import { getTableName } from "../lib/dbLib";

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

	const addNewUser = async (e) => {
		e.preventDefault();
		// const newUserData = {
		// 	id: uuid(),
		// 	firstName: e.target["firstName"].value,
		// 	lastName: e.target["lastName"].value,
		// 	displayName: e.target["displayName"].value,
		// 	email: e.target["email"].value,
		// 	userType: e.target["userType"].value,
		// 	streetAddressOne: e.target["streetAddressOne"].value,
		// 	streetAddressTwo: e.target["streetAddressTwo"].value,
		// 	city: e.target["city"].value,
		// 	provinceState: e.target["provinceState"].value,
		// 	country: e.target["country"].value,
		// 	postalZip: e.target["postalZip"].value,
		// 	phone: e.target["phone"].value,
		// 	isSubscribed: e.target["isSubscribed"].checked,
		// 	avatarUrl: e.target["avatarUrl"].value
		// };

		const creds = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: awsconfig.identityPoolIds.main,
			RoleArn: awsconfig.arns.roles.dynamo
		});

		AWS.config.update({
			region: awsconfig.regions.main,
			credentials: creds
		});

		const db = new DynamoDB();
		const table = await getTableName("User-", db);
		const putParams = {
			TableName: table,
			Item: {
				id: {
					S: uuid()
				},
				firstName: {
					S: e.target["firstName"].value
				},
				lastName: {
					S: e.target["lastName"].value
				},
				displayName: {
					S: e.target["displayName"].value
				},
				email: {
					S: e.target["email"].value
				},
				userType: {
					S: e.target["userType"].value
				},
				streetAddressOne: {
					S: e.target["streetAddressOne"].value
				},
				streetAddressTwo: {
					S: e.target["streetAddressTwo"].value
				},
				city: {
					S: e.target["city"].value
				},
				provinceState: {
					S: e.target["provinceState"].value
				},
				country: {
					S: e.target["country"].value
				},
				postalZip: {
					S: e.target["postalZip"].value
				},
				phone: {
					S: e.target["phone"].value
				},
				isSubscribed: {
					BOOL: e.target["isSubscribed"].checked
				},
				avatarUrl: {
					S: e.target["avatarUrl"].value
				}
			}
		};

		db.putItem(putParams, (err, _data) => {
			if (!err) {
				getAllUsers();
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
		userProvider.adminDeleteUser(
			{ UserPoolId: awsconfig.userPoolIds.main, Username: userName },
			(err, _data) => {
				if (!err) {
					getAllUsers();
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
						<form onSubmit={(e) => addNewUser(e)}>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='firstName' className='w-60'>
									First Name
								</label>
								<input
									type='text'
									name='firstName'
									id='firstName'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='lastName' className='w-60'>
									Last Name
								</label>
								<input
									type='text'
									name='lastName'
									id='lastName'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='displayName' className='w-60'>
									Display Name
								</label>
								<input
									type='text'
									name='displayName'
									id='displayName'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='email' className='w-60'>
									Email
								</label>
								<input
									type='email'
									name='email'
									id='email'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='userType' className='w-60'>
									User Type
								</label>
								<select
									name='userType'
									id='userType'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								>
									<option value='PUBLIC'>PUBLIC</option>
									<option value='MEMBER'>MEMBER</option>
									<option value='ADMIN'>ADMIN</option>
								</select>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='streetAddressOne' className='w-60'>
									Street Address
								</label>
								<input
									type='text'
									name='streetAddressOne'
									id='streetAddressOne'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='streetAddressTwo' className='w-60'>
									Street Address Con't
								</label>
								<input
									type='text'
									name='streetAddressTwo'
									id='streetAddressTwo'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='city' className='w-60'>
									City
								</label>
								<input
									type='text'
									name='city'
									id='city'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='provinceState' className='w-60'>
									Province/State
								</label>
								<input
									type='text'
									name='provinceState'
									id='provinceState'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='country' className='w-60'>
									Country
								</label>
								<input
									type='text'
									name='country'
									id='country'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='postalZip' className='w-60'>
									Postal/Zip Code
								</label>
								<input
									type='text'
									name='postalZip'
									id='postalZip'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='phone' className='w-60'>
									Phone
								</label>
								<input
									type='tel'
									name='phone'
									id='phone'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='isSubscribed' className='w-60'>
									Subscribed?
								</label>
								<input
									type='checkbox'
									name='isSubscribed'
									id='isSubscribed'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<div className='mt-1 flex flex-nowrap'>
								<label htmlFor='avatarUrl' className='w-60'>
									User Avatar
								</label>
								<input
									type='url'
									name='avatarUrl'
									id='avatarUrl'
									className='ml-2 bg-gray-300 rounded w-full p-0.5'
								/>
							</div>
							<button type='submit' className='border-black'>
								Add New User
							</button>
						</form>
					</div>
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
				</div>
			</section>
		</ContextProvider>
	);
}
