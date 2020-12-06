const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;
const host = "localhost";
const app = express();
const mysqlConnection = require("./database/connection");
const usersRouter = require("./routes/userRoutes");

app.use(bodyParser.json());
app.use("/users", usersRouter);

app.listen(port, host, () => {
	console.log(`The Server Is Connected To http://${host}:${port}`);
});
