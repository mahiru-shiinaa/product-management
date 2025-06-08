const express = require("express");
var path = require('path');
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const moment = require('moment');


require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const database = require("./config/database");
const systemConfig = require("./config/system");

const route = require("./routes/client/index.route");
const adminRoute = require("./routes/admin/index.route");
database.connect();

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

app.use(cookieParser("helloworldnenenene"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App locial variables có thể sữ dụng ở trong tất cả các file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Routes
route(app);
adminRoute(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
