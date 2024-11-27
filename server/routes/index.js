const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainControllers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
// const path = require("path");
const passport = require('passport');
// const { isLoggedIn } = require('../middleware/checkAuth');
const User = require('../models/User');


/**
 * App Routes 
*/
router.get('/', mainController.homepage);
router.get('/about', mainController.about);


        

  /**
 * GET /
 * sign up page 
*/
router.get('/register', (req, res) => {
    const locals = {
        title: "register - Notes",
        description: "Notes App.",
      }
      res.render('register', {
        locals,
        layout: '../views/layouts/register-front-page'
      });
    });



  /**
 * GET /
 * loginpage 
*/


    router.get('/login', (req, res) => {
      const locals = {
              title: "login - NodeJs Notes",
              description: "Free NodeJS Notes App.",
            }
            res.render('login', {
              locals,
              layout: '../views/layouts/login-front-page'
            });
          });
  

    // / User registration route


       //sign up
       router.post('/register', async (req, res,) => {
        const { name, email, password } = req.body;
        try {
          let user = await User.findOne({ email });
          if (user) {
            req.flash('error_msg', 'Email is already registered');
            return res.redirect('/register');
          }
        
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const newUser = new User({ name, email, password: hashedPassword });
          await newUser.save();
          
          req.flash('success_msg', 'You are now registered and can log in');
          res.redirect('/dashboard');
        } catch (err) {
          console.log(err);
          res.redirect('/login');
        }
      });

/// User login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});



    // router.post("/register", async (req, res) => {
       
    //     const data = { 
    //         firstName: req.body.username,
    //          email: req.body.email, 
    //          password: req.body.password,  
    //         } 
       
    //      // Check if user already exists
    //     const existingUser = await User.findOne({name: data.email });
     
        
         
    //         if (existingUser) {
    //            res.redirect("register", { 
    //                     error: "Username already exists", 
    //                 layout: '../views/layouts/register-front-page'
    //                 });
    //         } else {
       
    //         // Hash the password using bcrypt
    //     const saltRounds = 10; // Number of salt rounds for bcrypt
    //     const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    
    //         // Create and save the new user
    //         data.password = hashedPassword;
    //         const newUser = new User(data);
    //         await newUser.save();
    //         return res.redirect("/dashboard");
        
    //     }
    // });
 
      
    



        
        
        
      

  
// router.post('/dashboard', mainController.postlogin);
// router.post('/dashboard', isLoggedIn, mainController.postsignup);

module.exports = router;