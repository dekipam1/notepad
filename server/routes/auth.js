const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require('bcrypt');
const User = require("../models/User");


passport.use(
  new LocalStrategy(async (email, password, done) => {
      try {
          // Find the user by username in the database
          const user = await User.findOne({ email });
          // If the user does not exist, return an error
          if (!user) {
              return done(null, false, { error: "Incorrect username" });
          }

          // Compare the provided password with the 
          // hashed password in the database
          const passwordsMatch = await bcrypt.compare(
              password,
              user.password
          );

          // If the passwords match, return the user object
          if (passwordsMatch) {
              return done(null, user);
          } else {
              // If the passwords don't match, return an error
              return done(null, false, { error: "Incorrect password" });
          }
      } catch (err) {
          return done(err);
      }
  })
);


// module.exports = function(passport) {
  // Local Strategy
  // passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  //   try {
  //     const user = await User.findOne({ email });
  //     if (!user) {
  //       return done(null, false, { message: 'That email is not registered' });
  //     }
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (isMatch) {
  //       return done(null, user);
  //     } else {
  //       return done(null, false, { message: 'Password incorrect' });
  //     }
  //   } catch (err) {
  //     done(err);
  //   }
  // }));


passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
     
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            
            email: profile.emails[0].value
      
        // googleId: profile.id,
        // userName: profile.displayName,
        // firstName: profile.name.givenName,
        // lastName: profile.name.familyName,
        // profileImage: profile.photos[0].value,
      });

      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);


// Google Login Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);


// Route if something goes wrong
router.get('/login-failure', (req, res) => {
  res.send('Something went wrong...');
});

// Destroy user session
router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if(error) {
      console.log(error);
      res.send('Error loggin out');
    } else {
      res.redirect('/')
    }
  })
});

//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (user) {
//           done(null, user);
//         } else {
//           user = await User.create(newUser);
//           done(null, user);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   )
// );

// Google Login Route
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// Retrieve user data
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login-failure",
//     successRedirect: "/dashboard",
//   })
// );

// Route if something goes wrong
// router.get('/login-failure', (req, res) => {
//   res.send('Something went wrong...');
// });

// Destroy user session
// router.get('/logout', (req, res) => {
//   req.session.destroy(error => {
//     if(error) {
//       console.log(error);
//       res.send('Error loggin out');
//     } else {
//       res.redirect('/')
//     }
//   })
// });


// Presist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Retrieve user data from session.
// Original Code
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// New
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});



module.exports = router;