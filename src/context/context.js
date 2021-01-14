import { Auth } from "aws-amplify";
import React, { createContext, useEffect, useState } from "react";

const initialState = {
	user: {}
};

export const AdminContext = createContext();

export function ContextProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(initialState);

	useEffect(() => {
		const getUser = async () => {
			const user = await Auth.currentAuthenticatedUser();
			if (user.attributes["sub"]) {
				Object.defineProperty(
					user.attributes,
					"cognitoId",
					Object.getOwnPropertyDescriptor(user.attributes, "sub")
				);
				delete user.attributes["sub"];
			}
			setCurrentUser(user);
		};
		getUser();
	}, []);

	return (
		<AdminContext.Provider
			value={{
				...currentUser
			}}
		>
			{children}
		</AdminContext.Provider>
	);
}
