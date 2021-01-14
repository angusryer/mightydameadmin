import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import SignUp from "./components/SignUp";
import ConfirmSignUp from "./components/ConfirmSignUp";
import SignIn from "./components/SignIn";
import ForgotPassword from "./components/ForgotPassword";
import Admin from "./components/Admin";

export default function App() {
	const [formState, setFormState] = useState("signUp");
	const [isAdmin, setIsAdmin] = useState(false);
	const [formError, setFormError] = useState(null);
	const [adminPanel, setAdminPanel] = useState(false);

	const authStateMessage = "You are currently logged out.";

	const toggleFormState = (newFormState) => {
		setFormState(newFormState);
		setAdminPanel(false);
		setFormError(null);
	};

	useEffect(() => {
		const checkSigninStatus = async () => {
			await Auth.currentAuthenticatedUser()
				.then((user) => {
					if (user) {
						const {
							signInUserSession: {
								idToken: { payload }
							}
						} = user;
						if (
							payload["cognito:groups"] &&
							payload["cognito:groups"].includes("Admin")
						) {
							setIsAdmin(true);
							setFormState("signedIn");
							setFormError(null);
						}
					}
				})
				.catch((_err) => {
					setFormError(authStateMessage);
				});
		};
		checkSigninStatus();
		setFormError(null);
	}, []);

	const signUp = async (form) => {
		const { username, email, password } = form;
		await Auth.signUp({
			username,
			password,
			attributes: { email }
		})
			.then((_res) => {
				setFormState("confirmSignUp");
				setFormError(null);
			})
			.catch((err) => {
				setFormError(err.message);
			});
	};

	const confirmSignUp = async (form) => {
		const { username, authcode } = form;
		await Auth.confirmSignUp(username, authcode)
			.then((_res) => {
				setFormState("signIn");
				setFormError(null);
			})
			.catch((err) => {
				console.log(err);
				setFormError(err.message);
			});
	};

	const signIn = async (form) => {
		const { username, password } = form;
		await Auth.signIn(username, password)
			.then((_res) => {
				// check to see if the user is an Admin
				Auth.currentAuthenticatedUser()
					.then((user) => {
						if (user) {
							const {
								signInUserSession: {
									idToken: { payload }
								}
							} = user;
							if (
								payload["cognito:groups"] &&
								payload["cognito:groups"].includes("Admin")
							) {
								setIsAdmin(true);
							} else {
								setIsAdmin(false);
							}
							setFormState("signedIn");
							setFormError(null);
						}
					})
					.catch((err) => {
						setFormError(authStateMessage);
					});
			})
			.catch((err) => {
				setFormError(err.message);
			});
	};

	const signOut = async () => {
		await Auth.signOut()
			.then((_res) => {
				window.location.href = "/";
			})
			.catch((err) => {
				setFormError(err.message);
			});
	};

	const renderForm = (formState, isAdmin) => {
		switch (formState) {
			case "signUp":
				return <SignUp signUp={signUp} toggleFormState={toggleFormState} />;

			case "confirmSignUp":
				return <ConfirmSignUp confirmSignUp={confirmSignUp} />;

			case "signIn":
				return <SignIn signIn={signIn} toggleFormState={toggleFormState} />;

			case "signedIn":
				if (isAdmin) {
					setAdminPanel(true);
				} else {
					window.location.replace(
						"https://main.d1yqt45w5sq9tb.amplifyapp.com/"
					);
				}
				break;

			case "forgotPassword":
				return <ForgotPassword toggleFormState={toggleFormState} />;

			default:
				return null;
		}
	};

	return adminPanel ? (
		<Admin signOut={signOut} />
	) : (
		<div className='flex flex-col items-center pt-5 '>
			<div className='max-w-5xl flex flex-col pt-5'>
				<span>{formError}</span>
				{renderForm(formState, isAdmin)}
			</div>
		</div>
	);
}
