import React from "react";
import Input from "./Input";
import SelectInput from "./SelectInput";
import { useFormFields } from "../lib/hooksLib";

export default function AddNewUser({ addNewUser }) {
	const [formFields, setFormFields] = useFormFields({});

	const styleConfig = {
		containerStyles: `mt-1 flex flex-nowrap`,
		labelStyles: `w-60`,
		inputStyles: `ml-2 bg-gray-100 rounded w-full p-0.5`
	};

	const selectOptions = ["PUBLIC", "MEMBER", "ADMIN"];

	return (
		<form onSubmit={(e) => addNewUser(e, formFields)}>
			<Input
				identifier='firstName'
				label='First Name'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.firstName}
			/>
			<Input
				identifier='lastName'
				label='Last Name'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.lastName}
			/>
			<Input
				identifier='displayName'
				label='Display Name'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.displayName}
			/>
			<Input
				identifier='userName'
				label='Username'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.userName}
			/>
			<Input
				identifier='email'
				label='Email'
				type='email'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.email}
			/>
			<SelectInput
				identifier='userType'
				label='User Type'
				options={selectOptions}
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.userType}
			/>
			<Input
				identifier='streetAddressOne'
				label='Street Address One'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.streetAddressOne}
			/>
			<Input
				identifier='streetAddressTwo'
				label='Street Address Two'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.streetAddressTwo}
			/>
			<Input
				identifier='city'
				label='City'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.city}
			/>
			<Input
				identifier='provinceState'
				label='Province/State'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.provinceState}
			/>
			<Input
				identifier='country'
				label='Country'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.country}
			/>
			<Input
				identifier='postalZip'
				label='Postal/Zip Code'
				type='text'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.postalZip}
			/>
			<Input
				identifier='phone'
				label='Phone'
				type='tel'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.phone}
			/>
			<Input
				identifier='isSubscribed'
				label='Subscribed?'
				type='checkbox'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.isSubscribed}
			/>
			<Input
				identifier='avatarUrl'
				label='User Avatar'
				type='url'
				styles={styleConfig}
				changeHandler={setFormFields}
				value={formFields.avatarUrl}
			/>
			<button
				type='submit'
				className='border-black hover:bg-purple-200 w-full align-middle text-center border rounded '
			>
				Add New User
			</button>
		</form>
	);
}
