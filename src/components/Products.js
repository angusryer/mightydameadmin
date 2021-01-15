// PRODUCTS
// id: ID!
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
// reviews: [Review]! @connection(name: "OfferReviewConnection")
// users: [EnrolledUsers]! @connection(keyName: "byOffer", fields: ["id"])

import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { awsconfig } from "../aws-config";
import Product from "./Product";
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

export default function Products() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		getAllProducts("Offer-");
	}, []);

	const getAllProducts = async (searchFragment) => {
		const tableName = await getTableName(searchFragment, db);
		queryParams.TableName = tableName;
		dbdoc.scan(queryParams, (err, data) => {
			if (!err) {
				const filteredData = data.Items.filter(
					(offer) => offer.offerType === "PRODUCT"
				);
				setProducts(filteredData);
			} else {
				console.error("DB Provider Unsuccessful ===> ", err);
			}
		});
	};

	const deleteProduct = async (id) => {
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
					getAllProducts("Offer-");
				} else {
					console.error("Delete product unsuccessful ==> ", err);
				}
			}
		);
	};

	const sendProductToDynamo = async (productObject) => {
		const tableName = await getTableName("Offer-", db);
		const putParams = {
			TableName: tableName,
			Item: {
				id: productObject.id,
				offerType: productObject.offerType,
				title: productObject.title,
				shortDescription: productObject.shortDescription,
				longDescription: productObject.longDescription,
				keywords: productObject.keywords,
				categories: productObject.categories,
				price: productObject.price,
				salePrice: productObject.salePrice,
				mainImageUrl: productObject.mainImageUrl,
				mainImageFileName: productObject.mainImageFileName,
				otherImageUrls: productObject.otherImageUrls,
				otherImageFileNames: productObject.otherImageFileNames,
				available: productObject.available,
				brand: productObject.brand
			}
		};

		dbdoc.put(putParams, (err, _data) => {
			if (!err) {
				getAllProducts("Offer-");
			} else {
				console.error("Add product unsuccessful ==> ", err);
			}
		});
	};

	const addProduct = (event) => {
		event.preventDefault();
		// TODO validation checks

		const productObject = {
			id: uuid(),
			offerType: "PRODUCT",
			title: event.target["title"].value,
			shortDescription: event.target["shortDescription"].value,
			longDescription: event.target["longDescription"].value,
			price: event.target["price"].value,
			salePrice: event.target["salePrice"].value,
			available: event.target["available"].checked,
			brand: event.target["brand"].value
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
		const mainImageFileName =
			"main-" + uuid() + "-" + event.target["mainImageFileName"].files[0].name;
		imagePromises.push(
			new AWS.S3.ManagedUpload({
				params: {
					Body: event.target["mainImageFileName"].files[0],
					Bucket: "mightydamegatsbybucket143702-dev",
					Key: `${mainImageFileName}`
				}
			}).promise()
		);

		let otherImageFileNames = [];
		for (let i = 0; i < otherImages.length; i++) {
			otherImageFileNames.push(uuid() + "-" + otherImages[i].name);
			const imageKey = otherImageFileNames[otherImageFileNames.length - 1];
			imagePromises.push(
				new AWS.S3.ManagedUpload({
					params: {
						Body: otherImages[i],
						Bucket: "mightydamegatsbybucket143702-dev",
						Key: imageKey
					}
				}).promise()
			);
		}

		Promise.all(imagePromises).then((resValues) => {
			productObject.keywords = keywordList;
			productObject.categories = categoryList;
			const otherFiles = resValues
				.filter((img) => img.Key.substring(0, 5) !== "main-")
				.map((img) => img.Key);
			const otherUrls = resValues
				.filter((img) => img.Key.substring(0, 5) !== "main-")
				.map((img) => img.Location);
			productObject.otherImageFileNames = otherFiles;
			productObject.otherImageUrls = otherUrls;
			productObject.mainImageFileName = resValues.find(
				(img) => img.Key.substring(0, 5) === "main-"
			).Key;
			productObject.mainImageUrl = resValues.find(
				(img) => img.Key.substring(0, 5) === "main-"
			).Location;
			sendProductToDynamo(productObject);
		});

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
		<>
			<h1>Products</h1>
			<div className='mt-5 flex flex-row w-full'>
				<div className='flex flex-col w-full max-w-xs'>
					<h3>Actions</h3>
					<div className='flex flex-row border rounded w-full'>
						<form
							className='flex flex-col'
							onSubmit={(event) => addProduct(event)}
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
							<button type='submit' className='border-gray-200'>
								Add Product
							</button>
						</form>
					</div>
				</div>
				<div className='flex flex-col w-full ml-5'>
					<h3>Current Products</h3>
					<div className='flex flex-col border rounded'>
						{products &&
							products.map((product, id) => {
								return (
									<Product
										key={id}
										{...product}
										deleteProduct={() => deleteProduct(product.id)}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</>
	);
}
