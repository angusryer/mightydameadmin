import AWS from "aws-sdk";

// custom config file to hold all the params that aws-exports does not
export const awsconfig = {
	regions: {
		main: "ca-central-1"
	},
	apiVersions: {
		cognito: "2016-04-18",
		dynamo: "",
		s3: ""
	},
	identityPoolIds: {
		main: "ca-central-1:94d63211-9f29-4d48-8263-21e03c283d36"
	},
	userPoolIds: {
		main: "ca-central-1_Fh59Vzag6"
	},
	arns: {
		roles: {
			dynamo: "arn:aws:iam::378986558342:role/mdf_dynamopoweruser",
			cognito: "arn:aws:iam::378986558342:role/mdf_cognitopoweruser"
		}
	},
	endpoints: {
		cognito: () =>
			new AWS.Endpoint("https://cognito-idp.ca-central-1.amazonaws.com"),
		dynamo: "",
		s3: ""
	}
};

function AWSglobalConfig() {
	const mainCredentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: awsconfig.identityPoolIds.main
	});

	const globalConfig = new AWS.Config({
		region: awsconfig.regions.main,
		credentials: mainCredentials
	});

	return globalConfig;
}

export default AWSglobalConfig;
