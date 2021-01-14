import React, { useState } from "react";

export default function UpdateUser({ user, confirmUpdateUser }) {
	const { id, firstName, lastName, displayName } = user;

	const [userValues, setUserValues] = useState({
		id,
		firstName,
		lastName,
		displayName
	});
	return (
		<form onSubmit={(e) => confirmUpdateUser(e)}>
			<div className='mt-1 flex flex-nowrap'>
				<label htmlFor='firstName' className='w-60'>
					First Name
				</label>
				<input
					type='text'
					name='firstName'
					id='firstName'
					value={userValues.firstName}
					onChange={setUserValues({
						...userValues,
						firstName: (e) => e.target["firstName"].value
					})}
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
	);
}
