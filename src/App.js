import React, { useState, useEffect } from "react";
import Amplify, { Auth } from "aws-amplify";
import SignUp from "./components/SignUp";
import ConfirmSignUp from "./components/ConfirmSignUp";
import SignIn from "./components/SignIn";

import config from "./aws-exports";

Amplify.configure(config);

export default function App() {
	const [formState, setFormState] = useState("signUp");
	const [isAdmin, setIsAdmin] = useState(false);
	const [formError, setFormError] = useState(null);

	const authStateMessage = "You are currently logged out.";

	const toggleFormState = (newFormState) => {
    setFormState(newFormState);
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
					.catch((_err) => {
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
				setFormState("signUp");
				setIsAdmin(false);
				setFormError(null);
			})
			.catch((err) => {
				setFormError(err.message);
			});
  };
  
  const forgotPassword = async () => {
    await Auth.forgotPassword()
  }

	const renderForm = (formState, isAdmin) => {
		switch (formState) {
			case "signUp":
				return <SignUp signUp={signUp} toggleFormState={toggleFormState} />;
			case "confirmSignUp":
				return <ConfirmSignUp confirmSignUp={confirmSignUp} />;
			case "signIn":
				return <SignIn signIn={signIn} forgotPassword={forgotPassword} toggleFormState={toggleFormState} />;
			case "signedIn":
				return isAdmin ? (
					<>
						<h3>Logged in as an administrative user</h3>
						<button type='button' onClick={signOut}>
							Sign Out
						</button>
					</>
				) : (
					<>
						<h3>You are logged in as a regular user</h3>
						<button type='button' onClick={signOut}>
							Sign Out
						</button>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<div className='flex flex-col'>
			<div className='max-w-fw flex flex-col'>
				<div className='pt-10'>
					<h1 className='text-5xl font-light'>
						Admin status: {isAdmin ? "ADMIN" : "NOT ADMIN"}
					</h1>
					<span>{formError}</span>
				</div>
				{renderForm(formState, isAdmin)}
			</div>
		</div>
	);
}
