import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Amplify from "aws-amplify";
import config from "./aws-exports";
import AWSglobalConfig from "./aws-config";
import App from "./App";
import "./index.css";

Amplify.configure(config);
AWSglobalConfig();

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
