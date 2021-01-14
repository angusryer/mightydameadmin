import React from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import SideBar from "./SideBar";

export default function Layout({ context, children, signOut }) {
	return (
		<>
			<Nav context={context} signOut={signOut} />
			<main>
				<SideBar />
				{children}
			</main>
			<Footer />
		</>
	);
}
