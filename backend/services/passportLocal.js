const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const Admin = require('../models/Admin');
//const db = require('../db.js');
const db = require('../db_localhost.js');
const bcrypt = require('bcryptjs');

// SOURCE: https://stackoverflow.com/questions/49771925/login-using-sequelize-and-passport-in-nodejs
module.exports = function(passport){
  // Local Strategy
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pword'
  },
      function (username, password, done) {
          User.findOne({ where: { email: username } })
               .then(function (user) {
                   if (!user) {
                       return done(null, false, { message: 'Incorrect username.' });
                   }
                   bcrypt.compare(password, user.pword).then((res) => {
                     if (!res) {
                         return done(null, false, { message: 'Incorrect password.' });
                     }
                     return done(null, user);
                   });
               })
               .catch(err => done(err));
      }
  ));

  // Admin Local Strategy
  passport.use('admin-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pword'
  },
      function (username, password, done) {
          Admin.findOne({ where: { email: username } })
               .then(function (admin) {
                   if (!admin) {
                       return done(null, false, { message: 'Incorrect admin username.' });
                   }
                   bcrypt.compare(password, admin.pword).then((res) => {
                     if (!res) {
                         return done(null, false, { message: 'Incorrect admin password.' });
                     }
                     return done(null, admin);
                   });
               })
               .catch(err => done(err));
      }
  ));


  passport.serializeUser(function(user, done) {
    let type
    if (isUser(user)) {
      type = 'user'
    } else if (isAdmin(user)) {
      type = 'admin'
    }

    const key = {
      id: user.id,
      type: type
    }
    done(null, key)
  });

  //https://gist.github.com/manjeshpv/84446e6aa5b3689e8b84
  passport.deserializeUser(function(key, done) {

    // Check if user should be searched in the User model or
    // in the Admin one
      const Model = key.type === 'user' ? User : Admin
      // Find the user, if found then pass it to the done() function

      if(key.type == 'user'){
        db.pool.query("select * from user_account where id = "+key.id,function(err,rows){
          done(err, rows[0]);
        });
      }else{
        db.pool.query("select * from admin_account where id = "+key.id,function(err,rows){
          done(err, rows[0]);
        });
      };
  });

  // SOURCE: https://gist.github.com/rojasmi1/c34ec82539d4b42c842ab0789ecbdcd1
  // Checks if the user is an instance of the User model
  const isUser = user => user instanceof User

  // Checks if the user is an instance of the Admin model
  const isAdmin = user => user instanceof Admin
}
