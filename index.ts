import express = require("express");
import cors = require("cors");
import cookieParser = require("cookie-parser");
import fs = require("fs");
import { MongoSetup } from "./db";
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

// init middleware
//app.use(logger);
app.use(cors());

// Initialize body parser middleware
app.use(express.json());
app.use(cookieParser(cookieSecret));
app.use(express.urlencoded({ extended: true }));

// Loads the file ./routes/api/members to handle requests at /api/members
app.use("/api/rooms", require("./routes/api/rooms"));

app.use(express.static("public", {extensions: ["html"] }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

app.get("/secure", (req, res) => {
	res.send("You are in");
});
