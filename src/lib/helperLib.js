export function getFormattedDate(dateObject) {
	const month = dateObject.getUTCMonth() + 1; //months from 1-12
	const day = dateObject.getUTCDate();
	const year = dateObject.getUTCFullYear();
	return year + "/" + month + "/" + day;
}
