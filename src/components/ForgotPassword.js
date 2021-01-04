import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";

export default function ForgotPassword({ toggleFormState }) {
	const [fields, handleFieldChange] = useFormFields({
        username: "",
		code: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [codeSent, setCodeSent] = useState(false);
	const [confirmed, setConfirmed] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const [isSendingCode, setIsSendingCode] = useState(false);

	const validateUsernameForm = () => {
		return fields.username.length > 0;
	};

	const validateResetForm = () => {
		return (
			fields.code.length > 0 &&
			fields.password.length > 0 &&
			fields.password === fields.confirmPassword
		);
	};

	const handleSendCodeClick = async (event) => {
		event.preventDefault();

		setIsSendingCode(true);

		try {
			await Auth.forgotPassword(fields.email)
				.then((_res) => {
					setCodeSent(true);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			onError(error);
			setIsSendingCode(false);
		}
	};

	async function handleConfirmClick(event) {
		event.preventDefault();

		setIsConfirming(true);

		try {
			await Auth.forgotPasswordSubmit(
				fields.email,
				fields.code,
				fields.password
			);
			setConfirmed(true);
		} catch (error) {
			onError(error);
			setIsConfirming(false);
		}
	}

	const renderRequestCodeForm = () => {
		return (
			<>
				<h3>Request a validation code to the email you signed up with by providing your username below:</h3>
				<form onSubmit={handleSendCodeClick}>
					<div id='username'>
						<label htmlFor='username'>Username</label>
						<input
							id='username'
							autoFocus
							type='text'
							value={fields.username}
							onChange={handleFieldChange}
						/>
					</div>
					<button type='submit' disabled={!validateUsernameForm()}>
						{isSendingCode ? "Sending confirmation..." : "Send Confirmation"}
					</button>
				</form>
			</>
		);
	};

	const renderConfirmationForm = () => {
		return (
			<form onSubmit={handleConfirmClick}>
				<div id='code'>
					<label htmlFor='code'>Confirmation Code</label>
					<input
						id='code'
						autoFocus
						type='tel'
						value={fields.code}
						onChange={handleFieldChange}
					/>
					<p>
						Please check the email you signed up with for the reset confirmation
						code.
					</p>
				</div>
				<hr />
				<div id='password'>
					<label htmlFor='password'>New Password</label>
					<input
						id='password'
						type='password'
						value={fields.password}
						onChange={handleFieldChange}
					/>
				</div>
				<div id='confirmPassword'>
					<label htmlFor='confirmPassword'>Confirm Password</label>
					<input
						id='confirmPassword'
						type='password'
						value={fields.confirmPassword}
						onChange={handleFieldChange}
					/>
				</div>
				<button type='submit' disabled={!validateResetForm()}>
					{isConfirming ? "Confirming..." : "Confirm"}
				</button>
			</form>
		);
	};

	const renderSuccessMessage = () => {
		return (
			<div className='success'>
				<p>Your password has been reset.</p>
				<p>
					<span onclick={() => toggleFormState("signIn")}>
						Click here to login with your new credentials.
					</span>
				</p>
			</div>
		);
	};

	return (
		<>
			<div className='ForgotPassword'>
				{!codeSent
					? renderRequestCodeForm()
					: !confirmed
					? renderConfirmationForm()
					: renderSuccessMessage()}
			</div>
			<span onClick={() => toggleFormState("signUp")}>Sign Up</span>
			<span onClick={() => toggleFormState("signIn")}>Sign In</span>
		</>
	);
}
