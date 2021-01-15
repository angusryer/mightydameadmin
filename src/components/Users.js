import AWS, { DynamoDB } from "aws-sdk";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import remove from "../assets/icons/xicon.svg";
import { awsconfig } from "../aws-config";
import { ContextProvider } from "../context/context";
import { getTableName } from "../lib/dbLib";
import { getFormattedDate } from "../lib/helperLib";
import AddNewUser from "./AddNewUser";
import UpdateUser from "./UpdateUser";
import UserInfo from "./UserInfo";

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

export default function Users(props) {
	const sub = Object(props).hasOwnProperty("attributes")
		? props.attributes.sub
		: "Sub not available";
	const [numberOfUsers, setNumberOfUsers] = useState(0);
	const [registeredUsers, setRegisteredUsers] = useState([]);
	const [updateActive, setUpdateActive] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});
	const [message, setMessage] = useState("");

	useEffect(() => {
		setMessage("");
		getAllUsers("User-");
	}, []);

	const getAllUsers = async (searchFragment) => {
		setMessage("");
		const tableName = await getTableName(searchFragment, db);
		scanParams.TableName = tableName;
		dbdoc.scan(scanParams, (err, data) => {
			if (!err) {
				setRegisteredUsers(data.Items);
				setNumberOfUsers(data.ScannedCount);
			} else {
				setMessage("Unable to scan the user database!");
				console.error("DB Provider Unsuccessful ===> ", err);
			}
		});
	};

	const addNewUser = async (e, formFields) => {
		e.preventDefault();
		if ((formFields.email == null) | (formFields.displayName == null)) {
			setMessage("You must provide an email and display name.");
		} else {
			setMessage("");
			const table = await getTableName("User-", db);
			const existingUserParams = {
				ExpressionAttributeValues: {
					":emailval": {
						S: formFields.email
					}
				},
				FilterExpression: "email = :emailval",
				TableName: table
			};

			const scanResult = await db.scan(existingUserParams).promise();
			const userDoesNotExist = scanResult.Items.length === 0;

			if (userDoesNotExist) {
				const putParams = {
					TableName: table,
					Item: {
						id: uuid(),
						cognitoId: null,
						dateRegistered: null,
						firstName: formFields.firstName,
						lastName: formFields.lastName,
						displayName: formFields.displayName,
						email: formFields.email,
						userType: formFields.userType || e.target.userType.value,
						streetAddressOne: formFields.streetAddressOne || null,
						streetAddressTwo: formFields.streetAddressTwo || null,
						city: formFields.city || null,
						provinceState: formFields.provinceState || null,
						country: formFields.country || null,
						postalZip: formFields.postalZip || null,
						phone: formFields.phone || null,
						isSubscribed: formFields.isSubscribed,
						dateSubscribed: formFields.isSubscribed
							? getFormattedDate(new Date())
							: "",
						avatarUrl: formFields.avatarUrl || null
					}
				};

				dbdoc.put(putParams, (err, _data) => {
					if (!err) {
						getAllUsers("User-");
					} else {
						setMessage("Unable to add the new user! Talk to a developer.");
						console.error("Add user unsuccessful ==> ", err);
					}
				});
			} else {
				setMessage(
					"A user with that email already exists. Please find that user from the list and update them from there."
				);
			}
		}
	};

	const deleteUser = () => {
		setMessage(
			"The ability to remove users has not been implemented. Have a chat with your developer."
		);
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
		setMessage("");
		const userSelected = registeredUsers.find((user) => user.id === userId);
		setSelectedUser(userSelected);
		setUpdateActive(true);
	};

	const confirmUpdateUser = async (e, formFields) => {
		e.preventDefault();
		setMessage("");
		const table = await getTableName("User-", db);
		const existingUserParams = {
			ExpressionAttributeValues: {
				":idval": {
					S: formFields.id
				}
			},
			FilterExpression: "id = :idval",
			TableName: table
		};

		const scanResult = await db.scan(existingUserParams).promise();
		const userExists = scanResult.Items.length > 0;

		if (userExists) {
			const updateParams = {
				TableName: table,
				Key: { id: formFields.id },
				UpdateExpression:
					"SET #firstName = :firstName, #lastName = :lastName, #userType = :userType, #displayName = :displayName, #streetAddressOne = :streetAddressOne, #streetAddressTwo = :streetAddressTwo, #city = :city, #provinceState = :provinceState, #country = :country, #postalZip = :postalZip, #phone = :phone, #isSubscribed = :isSubscribed, #dateSubscribed = :dateSubscribed ",
				ExpressionAttributeNames: {
					"#firstName": "firstName",
					"#lastName": "lastName",
					"#displayName": "displayName",
					"#userType": "userType",
					"#streetAddressOne": "streetAddressOne",
					"#streetAddressTwo": "streetAddressTwo",
					"#city": "city",
					"#provinceState": "provinceState",
					"#country": "country",
					"#postalZip": "postalZip",
					"#phone": "phone",
					"#isSubscribed": "isSubscribed",
					"#dateSubscribed": "dateSubscribed"
				},
				ExpressionAttributeValues: {
					":firstName": formFields.firstName || e.target.firstName.value,
					":lastName": formFields.lastName || e.target.lastName.value,
					":displayName": formFields.displayName || e.target.lastName.value,
					":userType": formFields.userType || e.target.userType.value,
					":streetAddressOne":
						formFields.streetAddressOne || e.target.streetAddressOne.value,
					":streetAddressTwo":
						formFields.streetAddressTwo || e.target.streetAddressTwo.value,
					":city": formFields.city || e.target.city.value,
					":provinceState":
						formFields.provinceState || e.target.provinceState.value,
					":country": formFields.country || e.target.country.value,
					":postalZip": formFields.postalZip || e.target.postalZip.value,
					":phone": formFields.phone || e.target.phone.value,
					":isSubscribed": formFields.isSubscribed,
					":dateSubscribed": formFields.isSubscribed
						? getFormattedDate(new Date())
						: ""
				}
			};

			dbdoc.update(updateParams, (err, _data) => {
				if (!err) {
					getAllUsers("User-");
				} else {
					setMessage("Unable to update the user! Talk to a developer.");
					console.error("Update user unsuccessful ==> ", err);
				}
			});
		} else {
			setMessage(
				"A user with that email does not exist. You'll have to add them manually."
			);
		}
		setUpdateActive(false);
	};

	const isOwner = (userId) => {
		return sub === userId;
	};

	return (
		<ContextProvider>
			<h1 className='text-2xl mb-5'>Users</h1>
			<span className='my-4 w-full'>Number of users: {numberOfUsers}</span>
			<div className='flex justify-between items-center h-6 my-1 w-full'>
				{message && (
					<>
						<span className='pl-5 text-red-800 text-sm'>{message}</span>
						<img
							src={remove}
							alt='remove message'
							className='h-4 w-auto'
							onClick={() => setMessage("")}
						/>
					</>
				)}
			</div>
			<div className='flex flex-row mr-2 w-full'>
				<div className='flex flex-col w-full max-w-md'>
					{updateActive ? (
						<UpdateUser
							selectedUser={selectedUser}
							confirmUpdateUser={confirmUpdateUser}
							setUpdateActive={setUpdateActive}
						/>
					) : (
						<AddNewUser addNewUser={addNewUser} />
					)}
				</div>
				<div className='w-full min-w-xs ml-5'>
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
		</ContextProvider>
	);
}
