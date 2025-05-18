const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("express-flash");

require("dotenv").config();
const app = express();
const port = process.env.PORT;
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const database = require("./config/database");
const systemConfig = require("./config/system");

const route = require("./routes/client/index.route");
const adminRoute = require("./routes/admin/index.route");
database.connect();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(cookieParser("helloworldnenenene"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// App locial variables có thể sữ dụng ở trong tất cả các file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes
route(app);
adminRoute(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
