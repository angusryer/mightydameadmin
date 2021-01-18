// SERVICES
// id: ID!
// offerType: OfferType!
// title: String!
// shortDescription: String!
// longDescription: String!
// keywords: [String]!
// categories: [String]!
// price: Float!
// salePrice: Float
// mainImageUrl: String!
// otherImageUrls: [String]!
// available: Boolean!
// brand: String
// numberOfSessions: Float
// lengthOfSessionInHours: Float
// frequencyOfSessionsPerWeek: Float
// programs: [Review]! @connection(name: "OfferReviewConnection")
// users: [EnrolledUsers]! @connection(keyName: "byOffer", fields: ["id"])

import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
// import path from "path";
import { awsconfig } from "../aws-config";
import Program from "./Program";
import { v4 as uuid } from "uuid";
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

const queryParams = {
	TableName: ""
};

export default function Programs() {
	const [programs, setPrograms] = useState([]);

	useEffect(() => {
		getAllPrograms("Offer-");
	}, []);

	const getAllPrograms = async (searchFragment) => {
		const tableName = await getTableName(searchFragment, db);
		queryParams.TableName = tableName;
		dbdoc.scan(queryParams, (err, data) => {
			if (!err) {
				const filteredData = data.Items.filter(
					(offer) => offer.offerType === "SERVICE"
				);
				setPrograms(filteredData);
			} else {
				console.error("DB Provider Unsuccessful ===> ", err);
			}
		});
	};

	const deleteProgram = async (id) => {
		const tableName = await getTableName("Offer-", db);
		dbdoc.delete(
			{
				TableName: tableName,
				Key: {
					id: id
				}
			},
			(err, _data) => {
				if (!err) {
					getAllPrograms("Offer-");
				} else {
					console.error("Delete program unsuccessful ==> ", err);
				}
			}
		);
	};

	const sendProgramToDynamo = async (programObject) => {
		const tableName = await getTableName("Offer-", db);
		const putParams = {
			TableName: tableName,
			Item: {
				id: programObject.id,
				offerType: programObject.offerType,
				title: programObject.title,
				shortDescription: programObject.shortDescription,
				longDescription: programObject.longDescription,
				keywords: programObject.keywords,
				categories: programObject.categories,
				price: programObject.price,
				salePrice: programObject.salePrice,
				mainImageUrl: programObject.mainImageUrl,
				mainImageFileName: programObject.mainImageFileName,
				otherImageUrls: programObject.otherImageUrls,
				otherImageFileNames: programObject.otherImageFileNames,
				available: programObject.available,
				brand: programObject.brand,
				numberOfSessions: programObject.numberOfSessions,
				lengthOfSessionInHours: programObject.lengthOfSessionInHours,
				frequencyOfSessionsPerWeek: programObject.frequencyOfSessionsPerWeek
			}
		};

		dbdoc.put(putParams, (err, _data) => {
			if (!err) {
				getAllPrograms("Offer-");
			} else {
				console.error("Add program unsuccessful ==> ", err);
			}
		});
	};

	const addProgram = (event) => {
		event.preventDefault();
		// TODO validation checks

		const programObject = {
			id: uuid(),
			offerType: "SERVICE",
			title: event.target["title"].value,
			shortDescription: event.target["shortDescription"].value,
			longDescription: event.target["longDescription"].value,
			price: event.target["price"].value,
			salePrice: event.target["salePrice"].value,
			available: event.target["available"].checked,
			brand: event.target["brand"].value,
			numberOfSessions: event.target["numberOfSessions"].value,
			lengthOfSessionInHours: event.target["lengthOfSessionInHours"].value,
			frequencyOfSessionsPerWeek:
				event.target["frequencyOfSessionsPerWeek"].value
		};

		const keywordText = event.target["keywords"].value;
		const keywordList = keywordText.split(",");

		const categoryText = event.target["categories"].value;
		const categoryList = categoryText.split(",");

		const otherImages = event.target["otherImageFileNames"].files;

		const s3creds = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: awsconfig.identityPoolIds.main,
			RoleArn: awsconfig.arns.roles.s3
		});

		AWS.config.update({
			region: awsconfig.regions.main,
			credentials: s3creds
		});

		let imagePromises = [];
		if (event.target["mainImageFileName"].files.length > 0) {
			const mainImageFileName =
				"main-" +
				uuid() +
				"-" +
				event.target["mainImageFileName"].files[0].name;

			imagePromises.push(
				new AWS.S3.ManagedUpload({
					params: {
						Body: event.target["mainImageFileName"].files[0],
						Bucket: "mightydamegatsbybucket143702-dev/public",
						Key: `${mainImageFileName}`
					}
				}).promise()
			);
		}

		let otherImageFileNames = [];
		for (let i = 0; i < otherImages.length; i++) {
			if (otherImages.length > 0) {
				otherImageFileNames.push(uuid() + "-" + otherImages[i].name);
				const imageKey = otherImageFileNames[otherImageFileNames.length - 1];
				imagePromises.push(
					new AWS.S3.ManagedUpload({
						params: {
							Body: otherImages[i],
							Bucket: "mightydamegatsbybucket143702-dev/public",
							Key: imageKey
						}
					}).promise()
				);
			}
		}

		const SUB_STRING_VAL = 12;
		const IMG_KEY_STRING = "public/main-";

		if (imagePromises.length > 0) {
			Promise.all(imagePromises).then((resValues) => {
				programObject.keywords = keywordList;
				programObject.categories = categoryList;
				const otherFiles = resValues
					.filter(
						(img) => img.Key.substring(0, SUB_STRING_VAL) !== IMG_KEY_STRING
					)
					.map((img) => img.Key.replace("public/", ""));
				const otherUrls = resValues
					.filter(
						(img) => img.Key.substring(0, SUB_STRING_VAL) !== IMG_KEY_STRING
					)
					.map((img) => img.Location);
				programObject.otherImageFileNames = otherFiles;
				programObject.otherImageUrls = otherUrls;
				programObject.mainImageFileName = resValues
					.find(
						(img) => img.Key.substring(0, SUB_STRING_VAL) === IMG_KEY_STRING
					)
					.Key.replace("public/", "");
				programObject.mainImageUrl = resValues.find(
					(img) => img.Key.substring(0, SUB_STRING_VAL) === IMG_KEY_STRING
				).Location;
				sendProgramToDynamo(programObject);
			});
		}

		event.target["title"].value = "";
		event.target["shortDescription"].value = "";
		event.target["longDescription"].value = "";
		event.target["keywords"].value = "";
		event.target["categories"].value = "";
		event.target["price"].value = 0;
		event.target["salePrice"].value = 0;
		event.target["mainImageFileName"].value = "";
		event.target["otherImageFileNames"].value = null;
		event.target["available"].checked = false;
		event.target["brand"].value = "";
		event.target["numberOfSessions"].value = 0;
		event.target["lengthOfSessionInHours"].value = 0;
		event.target["frequencyOfSessionsPerWeek"].value = 0;

		const creds = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: awsconfig.identityPoolIds.main,
			RoleArn: awsconfig.arns.roles.dynamo
		});

		AWS.config.update({
			region: awsconfig.regions.main,
			credentials: creds
		});
	};

	return (
		<section className='p-5 w-full'>
			<h1>Programs</h1>
			<div className='mt-5 flex flex-row w-full'>
				<div className='flex flex-col w-full max-w-xs'>
					<h3>Actions</h3>
					<div className='flex flex-row border rounded w-full'>
						<form
							className='flex flex-col'
							onSubmit={(event) => addProgram(event)}
						>
							<div className='flex'>
								<label htmlFor='title'>Title</label>
								<input className='pl-5' name='title' id='title' type='text' />
							</div>
							<div className='flex'>
								<label htmlFor='shortDescription'>Short Description</label>
								<input
									className='pl-5'
									name='shortDescription'
									id='shortDescription'
									type='text'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='longDescription'>Long Description</label>
								<textarea
									className='pl-5'
									name='longDescription'
									id='longDescription'
									rows='5'
									cols='50'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='keywords'>Keywords</label>
								<input
									className='pl-5'
									name='keywords'
									id='keywords'
									type='text'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='categories'>Categories</label>
								<input
									className='pl-5'
									name='categories'
									id='categories'
									type='text'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='price'>Price</label>
								<input
									className='pl-5'
									name='price'
									id='price'
									type='number'
									step='0.01'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='salePrice'>Sale Price</label>
								<input
									className='pl-5'
									name='salePrice'
									id='salePrice'
									type='number'
									step='0.01'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='mainImageFileName'>Main Image</label>
								<input
									className='pl-5'
									name='mainImageFileName'
									id='mainImageFileName'
									type='file'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='otherImageFileNames'>Other Images</label>
								<input
									className='pl-5'
									name='otherImageFileNames'
									id='otherImageFileNames'
									type='file'
									multiple
								/>
							</div>
							<div className='flex'>
								<label htmlFor='available'>Available</label>
								<input
									className='pl-5'
									name='available'
									id='available'
									type='checkbox'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='brand'>Brand</label>
								<input className='pl-5' name='brand' id='brand' type='text' />
							</div>
							<div className='flex'>
								<label htmlFor='numberOfSessions'>
									Total Number of Sessions
								</label>
								<input
									className='pl-5'
									name='numberOfSessions'
									id='numberOfSessions'
									type='number'
									step='0.01'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='lengthOfSessionInHours'>
									Length of Each Session (Hrs)
								</label>
								<input
									className='pl-5'
									name='lengthOfSessionInHours'
									id='lengthOfSessionInHours'
									type='number'
									step='0.01'
								/>
							</div>
							<div className='flex'>
								<label htmlFor='frequencyOfSessionsPerWeek'>
									Frequency of Sessions (per wk)
								</label>
								<input
									className='pl-5'
									name='frequencyOfSessionsPerWeek'
									id='frequencyOfSessionsPerWeek'
									type='number'
									step='0.01'
								/>
							</div>
							<button type='submit' className='border-gray-200'>
								Add Program
							</button>
						</form>
					</div>
				</div>
				<div className='flex flex-col w-full ml-5'>
					<h3>Current Programs</h3>
					<div className='flex flex-col border rounded'>
						{programs &&
							programs.map((program, id) => {
								return (
									<Program
										key={id}
										{...program}
										deleteProgram={() => deleteProgram(program.id)}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</section>
	);
}
