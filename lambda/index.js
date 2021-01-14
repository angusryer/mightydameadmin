/*
  this file will loop through all js modules which are uploaded to the lambda resource,
  provided that the file names (without extension) are included in the "MODULES" env variable.
  "MODULES" is a comma-delimmited string.
*/

const moduleNames = process.env.MODULES.split(",");
const modules = moduleNames.map((name) => require(`./${name}`));

exports.handler = (event, context, callback) => {
	for (let i = 0; i < modules.length; i += 1) {
		const { handler } = modules[i];
		handler(event, context, callback);
	}
};

const request = {
	version: "1",
	region: "ca-central-1",
	userPoolId: "ca-central-1_Fh59Vzag6",
	userName: "mightydame",
	callerContext: {
		awsSdkVersion: "aws-sdk-unknown-unknown",
		clientId: "2npvln9kb3rsl0g7vhkkadhts9"
	},
	triggerSource: "PostConfirmation_ConfirmSignUp",
	request: {
		userAttributes: {
			sub: "72b88c53-4f43-4bcb-aaff-279bfeb3cc19",
			"cognito:user_status": "CONFIRMED",
			email_verified: "true",
			email: "fitness@mightydame.com"
		}
	},
	response: {}
};
