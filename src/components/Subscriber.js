import React from "react";

export default function Subscriber({ id, email, userType }) {
	return (
		<div
			id={id}
			className='mt-2 p-2 mb-4 relative border rounded border-gray-50'
		>
			<div className='flex flex-col'>
				<span className='text-xs'>ID: {id}</span>
				<span className='text-xs'>Email: {email}</span>
				<span className='text-xs'>User Type: {userType}</span>
			</div>
		</div>
	);
}
