import React from "react";

export default function Footer({ username }) {
	return (
		<footer className='flex justify-between bg-gray-200 p-1.5'>
			<p>&#169; All Rights Reserved, Mighty Dame Fitness</p>
			<p>{username ? "You are logged in." : "You are not logged in."}</p>
		</footer>
	);
}
