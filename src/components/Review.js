import React from "react";
import Rating from "./Rating";

export default function Review({ rating, title, user, comment }) {
	return (
		<div className="p-4 border rounded border-gray-50 ">
			<div className="flex flex-row flex-nowrap">
					<Rating value={rating.N} height='5' />
				<span>{`${rating.N} bars`}</span>
			</div>
			<span className='text-base'>{title.S}</span>
			<blockquote className="text-sm">{`"${comment.S}"`}</blockquote>
			<div className="flex flex-row content-center">
				<div>
					<img className="w-8 h-8 text-xs" src={user.M.image.S} alt='Normal person' />
				</div>
				<span className="text-sm">{user.M.name.S}</span>
			</div>
		</div>
	);
}
