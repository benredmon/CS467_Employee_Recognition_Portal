const express = require('express');
const router = require('express').Router();
const passport = require('passport');

//login process
router.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(401).json(err); }
    if (!user) { return res.status(401).json(info); }
    req.logIn(user, function(err) {
      if (err) { return res.status(401).json(err); }
      //return res.status(200).json({message: 'Login Success.'});
      res.send(JSON.stringify(user.dataValues));
    });
  })(req, res, next);
});

//admin login process
router.post('/adminlogin', function(req, res, next){
  passport.authenticate('admin-local', function(err, user, info) {
    if (err) { return res.status(401).json(err); }
    if (!user) { return res.status(401).json(info); }
    req.logIn(user, function(err) {
      if (err) { return res.status(401).json(err); }
      //return res.status(200).json({message: 'Admin Login Success.'});
      res.send(JSON.stringify(user.dataValues));
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.clearCookie('myname.sid');
    // Don't redirect, just print text
    res.json({message: 'Log Out Successful.'});
  });
});

router.post('/adminlogout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.clearCookie('myname.sid');
    // Don't redirect, just print text
    res.json({message: 'Admin Log Out Successful.'});
  });
});

module.exports = router;
