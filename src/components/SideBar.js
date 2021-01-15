import React from "react";
import { NavLink } from "react-router-dom";

export default function SideBar() {
	let style = `w-32 pl-3 hover:bg-purple-50 border rounded`;

	return (
		<aside className='flex flex-col min-w-min p-5 bg-gray-200'>
			<NavLink className={style} activeClassName="active-link" to='/dashboard'>
				Dashboard
			</NavLink>
			<NavLink className={style} activeClassName="active-link" to='/users'>
				Users
			</NavLink>
			<NavLink className={style} activeClassName="active-link" to='/subscriptions'>
				Subscriptions
			</NavLink>
			<NavLink className={style} activeClassName="active-link" to='/programs'>
				Programs
			</NavLink>
			<NavLink className={style} activeClassName="active-link" to='/products'>
				Products
			</NavLink>
			<NavLink className={style} activeClassName="active-link" to='/reviews'>
				Reviews
			</NavLink>
		</aside>
	);
}
