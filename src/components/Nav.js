import React from "react";
import logo from "../assets/images/logo.png";

export default function Nav({ signOut }) {
	return (
		<nav className='flex justify-between items-center bg-gray-200 p-3'>
			<div className='ml-9 w-16 h-16'>
				<img className='w-16 h-auto' src={logo} alt='Mighty Dame Fitness' />
			</div>
			<button
				type='button'
				className='min-w-min w-48 max-w-s h-10 content-center bg-secondary hover:bg-purple-700 hover:text-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
				onClick={() => signOut()}
			>
				Sign Out
			</button>
		</nav>
	);
}
