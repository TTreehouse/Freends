"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieSecret = void 0;
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const db_1 = require("./db");
const heroku_ssl_redirect_1 = require("heroku-ssl-redirect");
const expressSitemapXml = require("express-sitemap-xml");
var robots = require("robots.txt");
var compression = require("compression");
const app = express();
let cookieSecret;
exports.cookieSecret = cookieSecret;
if (fs.existsSync("./cookie-secret.txt")) {
    exports.cookieSecret = cookieSecret = fs.readFileSync("./cookie-secret.txt", "utf8");
}
else {
    exports.cookieSecret = cookieSecret = "";
    console.error('"cookie-secret.txt" Authentication will be broken and no one will pass.');
}
//Init Db
db_1.MongoSetup();
app.use(heroku_ssl_redirect_1.default());
app.use(cors());
app.use(expressSitemapXml(() => {
    return ["/"];
}, "https://freends.me"));
app.use(robots(__dirname + "/robots.txt"));
app.use(compression());
app.use(express.json());
app.use(cookieParser(cookieSecret));
app.use(express.urlencoded({ extended: true }));
//Routes non www requests to www requests
app.all(/.*/, function (req, res, next) {
    var host = req.header("host");
    if (host.match(/^www\..*/i)) {
        next();
    }
    else {
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
//# sourceMappingURL=index.js.map