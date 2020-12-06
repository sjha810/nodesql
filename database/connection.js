const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

connection.connect((err) => {
	if (!err) {
		console.log(`The Database Has Been Connected`);
	} else {
		console.log(`Error Occured While Connecting` + err);
	}
});

module.exports = connection;
