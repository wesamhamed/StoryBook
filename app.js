const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override")
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const storiesRoutes = require("./routes/stories");
//Constants
const PORT = process.env.PORT || 3000;
const app = express();

//Load Config 
dotenv.config({ path: './config/config.env' });

//Passport config
require("./config/passport")(passport);

//Database connection
connectDB();

//Logging http requests
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}
//Handlebars helpers
const { formatDate, editIcon, select, stripTags, truncate } = require("./helpers/hbs");
//Hnadlebars
app.engine('.hbs', exphbs({ helpers: { formatDate, editIcon, select, stripTags, truncate }, defaultLayout: "main", extname: '.hbs' }));
app.set('view engine', '.hbs');

//sessions
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })

}));
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//Set global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
//Method OVerride
app.use(methodOverride('_method'));
//Routes
app.use(indexRoutes);
app.use('/auth', authRoutes);
app.use("/stories", storiesRoutes);
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})