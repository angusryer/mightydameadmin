export const getTableName = (stringFragment, dbase) => {
	return new Promise((resolve, reject) => {
		dbase.listTables((err, data) => {
			let table = "";
			if (!err) {
				table = data.TableNames.find((table) => {
					return table.includes(stringFragment);
				});
				resolve(table);
			} else {
				console.log("listTables error ===> ", err);
				reject();
			}
		});
	});
};
