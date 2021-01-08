import React, { useState } from "react";
import Rating from "./Rating";
import deleteIcon from "../assets/icons/xicon.svg";

export default function Review({
	id,
	rating,
	title,
	user,
	comment,
	deleteReview
}) {
	const [isActive, setIsActive] = useState(false);
	return (
		<div
			id={id}
			className='relative p-4 border rounded border-gray-50'
			onMouseOver={() => setIsActive(true)}
			onMouseLeave={() => setIsActive(false)}
		>
			<div className='absolute top-0 right-0 w-auto h-8'>
				{isActive && (
					<div className='flex'>
						<img
							className='rounded hover:bg-red-300'
							onClick={() => deleteReview(id)}
							src={deleteIcon}
							alt='delete review'
						/>
					</div>
				)}
			</div>
			<div className='flex flex-row flex-nowrap'>
				<Rating value={rating} height='5' />
				<span>{`${rating} bars`}</span>
			</div>
			<span className='text-base'>{title}</span>
			<blockquote className='text-sm'>{`"${comment}"`}</blockquote>
			<div className='flex flex-row content-center'>
				<div>
					<img
						className='w-8 h-8 text-xs'
						src={user.image}
						alt='Normal person'
					/>
				</div>
				<span className='text-sm'>{user.name}</span>
			</div>
		</div>
	);
}
