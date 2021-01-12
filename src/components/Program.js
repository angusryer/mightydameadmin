import React, { useState, useEffect } from "react";
import deleteIcon from "../assets/icons/xicon.svg";
import AWS from "aws-sdk";
import { awsconfig } from "../aws-config";

export default function Program({
	id,
	title,
	shortDescription,
	longDescription,
	keywords,
	categories,
	price,
	salePrice,
	mainImageFileName,
	otherImageFileNames,
	available,
	brand,
	numberOfSessions,
	lengthOfSessionInHours,
	frequencyOfSessionsPerWeek,
	deleteProgram
}) {
	const [isActive, setIsActive] = useState(false);
	const [mainImage, setMainImage] = useState();
	const [otherImages, setOtherImages] = useState();

	const creds = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: awsconfig.identityPoolIds.main,
		RoleArn: awsconfig.arns.roles.s3
	});

	AWS.config.update({
		region: awsconfig.regions.main,
		credentials: creds
	});

	const s3 = new AWS.S3();

	const getImage = async (filename) => {
		const response = s3
			.getObject({
				Bucket: "mightydamegatsbybucket143702-dev",
				Key: filename
			})
			.promise();
		return response;
	};

	const encode = (data) => {
		let buf = Buffer.from(data);
		let base64 = buf.toString("base64");
		return base64;
	};

	useEffect(() => {
		getImage(mainImageFileName).then((imgData) => {
			setMainImage(`data:image/jpeg;base64,${encode(imgData.Body)}`);
		});
		let imageArray = [];
		otherImageFileNames.forEach((image) => {
			getImage(image).then((imgData) => {
				imageArray.push(`data:image/jpeg;base64,${encode(imgData.Body)}`);
			});
			setOtherImages(imageArray);
		});
	}, []);

	return (
		<div
			id={id}
			className='relative p-4 border rounded border-gray-50'
			onMouseOver={() => setIsActive(true)}
			onMouseLeave={() => setIsActive(false)}
		>
			<div className='absolute top-0 right-0 w-auto h-8'>
				{isActive && (
					<div className='flex'>
						<img
							className='rounded hover:bg-red-300'
							onClick={() => deleteProgram(id)}
							src={deleteIcon}
							alt='delete program'
						/>
					</div>
				)}
			</div>
			<div className='flex flex-col flex-nowrap'>
				<span>{`Title: ${title}`}</span>
				<span className='text-base'>{`Short Desc.: ${shortDescription}`}</span>
				<span className='text-base'>{`Long Desc.: ${longDescription}`}</span>
				<span className='text-base'>{`Keywords: ${keywords.join(", ")}`}</span>
				<span className='text-base'>{`Categories: ${categories.join(
					", "
				)}`}</span>
				<span className='text-base'>{`Price: CAD$${price}`}</span>
				<span className='text-base'>{`Sale Price: CAD$${salePrice}`}</span>
				<span>Main Image: </span>
				<img className='w-20 h-auto' src={mainImage} alt='main' />
				<span>Other Images</span>
				<div className='flex flex-wrap'>
					{otherImages &&
						otherImages.map((image, i) => {
							return <img key={i} className='w-12 h-auto' src={image} alt='other' />;
						})}
				</div>
				<span className='text-base'>{`Available: ${available}`}</span>
				<span className='text-base'>{`Brand: ${brand}`}</span>
				<span className='text-base'>{`Total No. of Sessions: ${numberOfSessions}`}</span>
				<span className='text-base'>{`Length of Session (hrs): ${lengthOfSessionInHours}`}</span>
				<span className='text-base'>{`Frequency of Sessions (per wk): ${frequencyOfSessionsPerWeek}`}</span>
			</div>
		</div>
	);
}
