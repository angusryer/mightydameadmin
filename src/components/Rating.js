import React from "react";
import star from "../assets/icons/star.png";

export default function Rating({ value }) {
	let starElements = [];
	for (let i = 0; i < value; i++) {
		starElements.push(
			<img
				className={`transform rotate-12 translate-y-1 h-5 w-auto`}
				key={i}
				src={star}
				alt='star'
			/>
		);
	}

	return (
		<div className='flex flex-row flex-nowrap h-4 items-center mr-2'>
			{starElements}
		</div>
	);
}
