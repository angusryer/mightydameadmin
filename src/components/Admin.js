import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AWS from "aws-sdk";
import { AdminContext, ContextProvider } from "../context/context";
import Campaigns from "./Campaigns";
import Dashboard from "./Dashboard";
import Layout from "./Layout";
import Products from "./Products";
import Programs from "./Programs";
import Reviews from "./Reviews";
import Users from "./Users";

export default function Admin({ signOut }) {
	return (
		<ContextProvider>
			<AdminContext.Consumer>
				{(context) => {
					return (
						<Layout context={context} signOut={signOut}>
							<Switch>
								<Route exact path='/'>
									<Redirect to='/dashboard' />
								</Route>
								<Route
									path='/dashboard'
									render={(routeProps) => <Dashboard {...routeProps} />}
								/>
								<Route
									path='/users'
									render={(routeProps) => <Users {...routeProps} />}
								/>
								<Route
									path='/programs'
									render={(routeProps) => <Programs {...routeProps} />}
								/>
								<Route
									path='/products'
									render={(routeProps) => <Products {...routeProps} />}
								/>
								<Route
									path='/campaigns'
									render={(routeProps) => <Campaigns {...routeProps} />}
								/>
								<Route
									path='/reviews'
									render={(routeProps) => <Reviews {...routeProps} />}
								/>
							</Switch>
						</Layout>
					);
				}}
			</AdminContext.Consumer>
		</ContextProvider>
	);
}
