import React, { useState } from "react";
import deleteIcon from "../assets/icons/xicon.svg";
import updateIcon from "../assets/icons/editIcon.svg";

export default function UserInfo({
	id,
	cognitoId,
	firstName,
	lastName,
	displayName,
	userName,
	email,
	userType,
	streetAddressOne,
	streetAddressTwo,
	city,
	provinceState,
	country,
	postalZip,
	phone,
	isSubscribed,
	dateSubscribed,
	deleteUser,
	updateUser,
	owner
}) {
	const [isActive, setIsActive] = useState(false);
	const [showExtraInfo, setShowExtraInfo] = useState(false);

	return (
		<div
			id={id}
			className='mt-2 p-2 mb-4 relative border rounded border-gray-50 hover:bg-blue-50'
			onMouseOver={() => setIsActive(true)}
			onMouseLeave={() => setIsActive(false)}
		>
			<div className='absolute top-0 right-0 w-auto h-8'>
				{!owner && isActive && (
					<div className='flex'>
						<img
							className='rounded-full hover:bg-blue-300 cursor-pointer'
							onClick={() => updateUser(id)}
							src={updateIcon}
							alt='update user'
						/>
						<img
							className='rounded-full hover:bg-red-300 cursor-pointer'
							onClick={() => deleteUser(displayName)}
							src={deleteIcon}
							alt='delete user'
						/>
					</div>
				)}
			</div>
			<div
				className='flex flex-col cursor-pointer'
				onClick={() => setShowExtraInfo(!showExtraInfo)}
			>
				<span className='text-xs'>Username: {userName}</span>
				<span className='text-xs'>
					Display Name: <span className='font-semibold'>{displayName}</span>
				</span>
				<span className='text-xs'>Email: {email}</span>
				<span className='text-xs'>
					Subscribed?: {isSubscribed ? "YES" : "NO"}
				</span>
				<span className='text-xs'>User Type: {userType}</span>
				{showExtraInfo && (
					<>
						<span className='text-xs'>First Name: {firstName}</span>
						<span className='text-xs'>Last Name: {lastName}</span>
						<span className='text-xs'>Date Subscribed: {dateSubscribed}</span>
						<span className='text-xs'>Phone: {phone}</span>
						<span className='text-xs'>Street Address: {streetAddressOne}</span>
						<span className='text-xs'>
							Street Address (2): {streetAddressTwo}
						</span>
						<span className='text-xs'>City: {city}</span>
						<span className='text-xs'>Province/State: {provinceState}</span>
						<span className='text-xs'>Country: {country}</span>
						<span className='text-xs'>Postal/Zip: {postalZip}</span>
						<span className='text-xs'>ID: {id}</span>
						<span className='text-xs'>Member ID: {cognitoId}</span>
					</>
				)}
			</div>
		</div>
	);
}
