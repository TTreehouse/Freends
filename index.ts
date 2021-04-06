import express = require("express");
import cors = require("cors");
import cookieParser = require("cookie-parser");
import fs = require("fs");
import { MongoSetup } from "./db";
import sslRedirect from "heroku-ssl-redirect";
const app = express();

export { cookieSecret };

let cookieSecret: string;
if (fs.existsSync("./cookie-secret.txt")) {
	cookieSecret = fs.readFileSync("./cookie-secret.txt", "utf8");
} else {
	cookieSecret = "";
	console.error(
		'"cookie-secret.txt" Authentication will be broken and no one will pass.'
	);
}

//Init Db
MongoSetup();

app.use(sslRedirect());
app.use(cors());

app.use(express.json());
app.use(cookieParser(cookieSecret));
app.use(express.urlencoded({ extended: true }));

// Loads the file ./routes/api/rooms to handle requests at /api/rooms
app.use("/api/rooms", require("./routes/api/rooms"));

app.use(express.static("public", { extensions: ["html"] }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

// 404 Page. Must be last as it catches all requests not otherwise handled.
app.get("*", function (req, res) {
	res.redirect("https://freends.me", 404);
});
