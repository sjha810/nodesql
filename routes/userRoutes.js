const Router = require("express").Router();
const mysqlConn = require("../database/connection");
const Promise = require("bluebird");
const queryAsync = Promise.promisify(mysqlConn.query.bind(mysqlConn));

Router.get("/", (req, res) => {
	let numRows;
	let numPerPage = parseInt(req.query.npp, 10) || 1;
	console.log(numPerPage);
	let page = parseInt(req.query.page, 10) || 1;
	console.log(`page:${page}`);
	let numPages;
	let skip = page * numPerPage + 1;
	console.log(`skip"${skip}`);
	// Here we compute the LIMIT parameter for MySQL query
	let limit = skip + "," + numPerPage;
	console.log(`limit:${limit}`);
	queryAsync("SELECT count(*) as numRows FROM tb_user")
		.then((results) => {
			numRows = results[0].numRows;
			numPages = Math.ceil(numRows / numPerPage);
			console.log(`numPages:${numPages}, numRows:${numRows}`);
			console.log("number of pages:", numPages);
		})
		.then(() =>
			queryAsync("SELECT * FROM tb_user ORDER BY user_id DESC LIMIT " + limit)
		)
		.then((results) => {
			const responsePayload = {
				results: results,
			};
			if (page < numPages) {
				responsePayload.pagination = {
					current: page,
					perPage: numPerPage,
					previous: page > 0 ? page - 1 : undefined,
					next: page < numPages - 1 ? page + 1 : undefined,
				};
			} else
				responsePayload.pagination = {
					err:
						"queried page " +
						page +
						" is >= to maximum page number " +
						numPages,
				};
			res.json(responsePayload);
		})
		.catch(function (err) {
			console.error(err);
			res.json({ err: err });
		});
});
Router.get("/:id", (req, res) => {
	queryAsync(
		"SELECT * FROM tb_user WHERE user_id = 1 OR user_id= 5 OR user_id = 7",
		[req.params.id],
		(err, rows, fields) => {
			if (!err) {
				res.status(200).json(rows);
			} else {
				res.status(400).json(err);
			}
		}
	);
});

module.exports = Router;
