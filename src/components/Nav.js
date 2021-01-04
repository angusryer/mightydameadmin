import React from "react";

export default function Nav({context, signOut}) {
	return (
		<nav>
			You are currently logged in as: {context.username}
			<button type='button' onClick={signOut}>
				Sign Out
			</button>
		</nav>
	);
}
