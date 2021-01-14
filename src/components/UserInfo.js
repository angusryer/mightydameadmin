import React, { useState } from "react";
import deleteIcon from "../assets/icons/xicon.svg";
import updateIcon from "../assets/icons/editIcon.svg";

export default function UserInfo({
	id,
	cognitoId,
	displayName,
	email,
	emailVerified,
	accountEnabled,
	registeredOn,
	userStatus,
	deleteUser,
	updateUser,
	owner
}) {
	const [isActive, setIsActive] = useState(false);

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
							className='rounded hover:bg-blue-300'
							onClick={() => updateUser(id)}
							src={updateIcon}
							alt='update user'
						/>
						<img
							className='rounded hover:bg-red-300'
							onClick={() => deleteUser(displayName)}
							src={deleteIcon}
							alt='delete user'
						/>
					</div>
				)}
			</div>
			<div className='flex flex-col'>
				<span className='text-xs'>ID: {id}</span>
				<span className='text-xs'>Username: {displayName}</span>
				<span className='text-xs'>Email: {email}</span>
				<span className='text-xs'>Email verified? {emailVerified}</span>
				<span className='text-xs'>Account enabled? {accountEnabled}</span>
				<span className='text-xs'>Registered On: {registeredOn}</span>
				<span className='text-xs'>Account confirmed Status: {userStatus}</span>
			</div>
		</div>
	);
}
