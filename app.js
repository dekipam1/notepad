require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require("method-override");
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const path = require("path");
const bcrypt = require('bcrypt');


const app = express();
const port = 5000 || process.env.PORT;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
//   cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
//   Date.now() - 30 * 24 * 60 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
// Conntect to Database
connectDB();  

// Connect flash middleware
app.use(flash());

app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// const User = new mongoose.model("User", userSchema);

// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');



// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));






// app.post("/register", function(req, res) {

//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
//     const newUser = new User({
// email: req.body,username,
// password: hash
// });
// newUser.save(function(err){
//   if (err) {
//     console.log(err);
//   } else{
//     res.render("dashboard");
//   }
// });
// });
// });


// Handle 404
app.get('*', function(req, res) {
  //res.status(404).send('404 Page Not Found.')
  res.status(404).render('404');
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});