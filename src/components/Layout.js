import React from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import SideBar from "./SideBar";

export default function Layout({ context, children, signOut }) {
	return (
		<>
			<Nav context={context} signOut={signOut} />
			<main className='flex'>
				<SideBar />
				<section className='p-5 w-full'>{children}</section>
			</main>
			<Footer {...context} />
		</>
	);
}
