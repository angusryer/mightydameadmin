import React from "react";
import Button from "./Button";

export default function Nav({ context, signOut }) {
	return (
		<nav className='h-20 bg-gray-200 p-3 flex flex-row justify-between'>
			<span className="block content-center">
				You are currently logged in as:{" "}
				<span className='font-bold'>{context.username}</span>
			</span>
			<Button innerText="Sign Out" callBack={signOut} />
		</nav>
	);
}
