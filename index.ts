import express = require("express");
import cors = require("cors");
import cookieParser = require("cookie-parser");
import fs = require("fs");
import { MongoSetup } from "./db";
import sslRedirect from "heroku-ssl-redirect";
import expressSitemapXml = require("express-sitemap-xml");
var robots = require("robots.txt");
var compression = require("compression");
import rateLimit = require("express-rate-limit");

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

app.use(
	expressSitemapXml(() => {
		return ["/"];
	}, "https://freends.me")
);
app.use(robots(__dirname + "/robots.txt"));

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per window
});

app.use(limiter);

app.use(compression());
app.use(express.json());
app.use(cookieParser(cookieSecret));
app.use(express.urlencoded({ extended: true }));

//Routes non www requests to www requests
app.all(/.*/, function (req, res, next) {
	var host = req.header("host");
	if (host.match(/^www\..*/i)) {
		next();
	} else {
		res.redirect(301, "http://www." + host);
	}
});

// Loads the file ./routes/api/rooms to handle requests at /api/rooms
app.use("/api/rooms", require("./routes/api/rooms"));

app.use(express.static("public", { extensions: ["html"] }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

// 404 Page. Must be last as it catches all requests not otherwise handled.
app.get("*", function (req, res) {
	res.redirect("/");
});
