const express           = require('express');
const router            = require('express').Router();
const cors              = require('cors');
const bcrypt            = require('bcryptjs');
const bodyParser        = require('body-parser');
const passport          = require('passport');
const session           = require('express-session');
const hookLocalStrategy = require('./services/passportLocal');
const nodemailer        = require('nodemailer');
const generator         = require('generate-password');
const mysql             = require('./db_localhost.js')  // for localhost database.
//var mysql             = require('./db.js');           // for OSU luimi database

var app = express();

// Test Database
mysql.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

// Set Database and Port Number
app.set('port', 32323);
app.set('mysql', mysql);

// CORS Middleware
app.use(cors({
  // for FLIP
  //origin:'http://web.engr.oregonstate.edu',
  // for local testing
  origin: 'http://localhost:4200',
  credentials: true
}));


// SOURCE: https://www.youtube.com/watch?v=ma9tKRR0dGk&index=4&list=PLmGlSqRtRSPjL9MxaiaXQcfVxswKErJTq
app.use(session({
  name:'myname.sid',
  secret:'secret',
  saveUninitialized:false,
  resave:false,
  cookie:{
    maxAge:36000000,
    httpOnly:false,
    secure:false
  }
}));

// Hook the passport Local strategy.
hookLocalStrategy(passport);

// Hook up and initialize Passport authentication
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({limit: '50mb'}));


// Home route.
app.get('/', function(req, res) {
    //res.send('Message from backend/app.js...');
    res.status(200).json({message:'Logout Success from backend/app.js'});
});

// Login ROUTES
app.use('/api', require('./routes/api'));


// -- ADMIN DASHBOARD ROUTES --

// list all users
app.get('/listusers', (req, res) => {
    mysql.pool.query('SELECT * FROM user_account', (err, result) => {
      if(err) throw err;
    	console.log('./listusers: database found...');
      res.send(JSON.stringify(result));
    });
});

// list one user - Admin service
app.get('/listuser/:id', (req, res) => {
    mysql.pool.query(`SELECT fname, lname, email, signature FROM user_account WHERE id=${req.params.id}`, (err, result) => {
      if(err) throw err;
      console.log('./listuser: database found...');
      res.send(JSON.stringify(result));
    });
});

// list one user - user service (could combine with above route - need to investigate)
app.get('/getuser/:id', (req, res) => {
    mysql.pool.query(`SELECT fname, lname, email, signature FROM user_account WHERE id=${req.params.id}`, (err, result) => {
      if(err) throw err;
      console.log('./listuser: database found...');
      res.send(JSON.stringify(result[0]));
    });
});

// add user
app.post('/adduser', (req, res) => {
  let newUserFname = req.body.fname;
  let newUserLname = req.body.lname;
  let newUserEmail = req.body.email;
  let newUserPword = req.body.pword;
  let newUserSignature = req.body.signature;

  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUserPword, salt, function(err, hash){
      if(err){
        console.log(err);
      }
      newUserPword = hash;

      mysql.pool.query('INSERT INTO user_account SET fname = ?, lname = ?, email = ?, pword = ?, signature = ?',
                      [newUserFname, newUserLname, newUserEmail, newUserPword, newUserSignature],
                      (err, result) => {
        if(err) throw err;
        console.log("./adduser: entry added");
        res.send(JSON.stringify(result));
      });
    });
  });
});

// update user
app.post('/updateuser/:id', (req, res) => {
    mysql.pool.query(`UPDATE user_account SET fname = ?, lname = ?, email = ?, signature = ? WHERE id = ?`,
                    [req.body.fname, req.body.lname, req.body.email, req.body.signature, req.params.id],
                    (err, result) => {
    	if(err) throw err;
    	console.log("./updateuser: entry updated");
    	res.status(200).end();
    });
});

// update user name
app.post('/updatename/:id', (req, res) => {
    mysql.pool.query(`UPDATE user_account SET fname = ?, lname = ? WHERE id = ?`,
                    [req.body.fname, req.body.lname, req.params.id],
                    (err, result) => {
    	if(err) throw err;

    	console.log("./updateuser: entry updated");

      newName = req.body.fname + ' ' + req.body.lname;

      mysql.pool.query('UPDATE award_winner SET recipient = ? WHERE rid = ?', [newName, req.params.id], (err, result) => {
        if(err) throw err;
      });

      mysql.pool.query('UPDATE award_winner SET giver = ? WHERE gid = ?', [newName, req.params.id], (err, result) => {
        if(err) throw err;
      });

      mysql.pool.query('SELECT * FROM user_account WHERE id = ?', [req.params.id], (err, result) => {
        if(err) throw err;
        res.send(JSON.stringify(result[0]));
      });
    });
});

// update user password
app.post('/updatepword/:id', (req, res) => {

    let newUpdatedPword = req.body.pword;

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUpdatedPword, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUpdatedPword = hash;

        mysql.pool.query(`UPDATE user_account SET pword = ? WHERE id = ?`,
                        [newUpdatedPword, req.params.id],
                        (err, result) => {
        	if(err) throw err;

        	console.log("./updatepassword: entry updated");
          res.status(200).end();
        });
      });
    });
});

// delete user
app.get('/deleteuser/:id', (req, res) => {
    mysql.pool.query(`DELETE FROM user_account WHERE id=${req.params.id}`, (err, result) => {
      if(err) throw err;
      console.log("./deleteadmin: entry deleted");
    	res.status(202).end();
    });
});

// list all admins
app.get('/listadmins', (req, res) => {
    mysql.pool.query('SELECT * FROM admin_account', (err, result) => {
      if(err) throw err;
    	console.log('./listadmins: database found...');
      res.send(JSON.stringify(result));
    });
});

// list one admin
app.get('/listadmin/:id', (req, res) => {
    mysql.pool.query(`SELECT first_name, last_name, email, pword, master FROM admin_account WHERE id=${req.params.id}`, (err, result) => {
      if(err) throw err;
      console.log('./listadmin: database found...');
      res.send(JSON.stringify(result));
    });
});

// add admin
app.post('/addadmin', (req, res) => {
  let newAdminFname = req.body.first_name;
  let newAdminLname = req.body.last_name;
  let newAdminEmail = req.body.email;
  let newAdminPword = req.body.pword;
  let newAdminMaster = req.body.master;

  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newAdminPword, salt, function(err, hash){
      if(err){
        console.log(err);
      }
      newAdminPword = hash;

      mysql.pool.query('INSERT INTO admin_account SET first_name = ?, last_name = ?, email = ?, pword = ?, master = ?',
                      [newAdminFname, newAdminLname, newAdminEmail, newAdminPword, newAdminMaster],
                      (err, result) => {
        if(err) throw err;
        console.log("./addadmin: entry added");
        res.send(JSON.stringify(result));
      });
    });
  });
});

// update admin
app.post('/updateadmin/:id', (req, res) => {
    mysql.pool.query(`UPDATE admin_account SET first_name = ?, last_name = ?, email = ?, master = ? WHERE id = ?`,
                    [req.body.first_name, req.body.last_name, req.body.email, req.body.master, req.params.id],
                    (err, result) => {
    	if(err) throw err;
    	console.log("./updateadmin: entry updated");
    	res.status(200).end();
    });
});

// delete admin
app.get('/deleteadmin/:id', (req, res) => {
    mysql.pool.query(`DELETE FROM admin_account WHERE id=${req.params.id}`, (err, result) => {
      if(err) throw err;
      console.log("./deleteadmin: entry deleted");
    	res.status(202).end();
    });
});

// awards count
app.get('/awardscount', (req, res) => {
    mysql.pool.query('SELECT COUNT(id) AS count FROM award_winner', (err, result) => {
      if(err) throw err;
    	console.log('./awardscount: database found...');
      res.send(JSON.stringify(result));
    });
});

// top givers
app.get('/awardgivers', (req, res) => {
    mysql.pool.query(`SELECT CONCAT(G.fname, ' ', G.lname) AS 'grantedBy', COUNT(gid) AS giver FROM award_winner INNER JOIN user_account G ON G.id = gid GROUP BY grantedBy ORDER BY giver DESC`, (err, result) => {
      if(err) throw err;
    	console.log('./awardgivers: database found...');
      res.send(JSON.stringify(result));
    });
});

// top receivers
app.get('/awardreceivers', (req, res) => {
    mysql.pool.query(`SELECT CONCAT(R.fname, ' ', R.lname) AS 'received', COUNT(rid) AS receiver FROM award_winner INNER JOIN user_account R ON R.id = rid GROUP BY received ORDER BY receiver DESC`, (err, result) => {
      if(err) throw err;
    	console.log('./awardreceivers: database found...');
      res.send(JSON.stringify(result));
    });
});

// recent employee of the week
app.get('/eotw', (req, res) => {
    mysql.pool.query(`SELECT CONCAT(R.fname, ' ', R.lname) AS 'winner', date FROM award_winner INNER JOIN user_account R ON R.id = rid WHERE aid = '2' AND date > DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 day) AND date <= CURRENT_TIMESTAMP`, (err, result) => {
      if(err) throw err;
    	console.log('./eotw: database found...');
      res.send(JSON.stringify(result));
    });
});

// recent employee of the month
app.get('/eotm', (req, res) => {
    mysql.pool.query(`SELECT CONCAT(R.fname, ' ', R.lname) AS 'winner', date FROM award_winner INNER JOIN user_account R ON R.id = rid WHERE aid = '1' AND date > DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 day) AND date <= CURRENT_TIMESTAMP`, (err, result) => {
      if(err) throw err;
    	console.log('./eotm: database found...');
      res.send(JSON.stringify(result));
    });
});

// givers chart
app.get('/giverschart', (req, res) => {
    mysql.pool.query(`SELECT G.id, G.lname AS 'last', CONCAT(G.fname, ' ', G.lname) AS 'giver', SUM(case when aid = 1 then 1 else 0 end) eotm, SUM(case when aid = 2 then 1 else 0 end) eotw  FROM award_winner INNER JOIN user_account G ON G.id = gid GROUP BY G.id ORDER BY last ASC`, (err, result) => {
      if(err) throw err;
    	console.log('./awardgivers: database found...');
      res.send(JSON.stringify(result));
    });
});

// receivers chart
app.get('/receiverschart', (req, res) => {
    mysql.pool.query(`SELECT R.id, R.lname AS 'last', CONCAT(R.fname, ' ', R.lname) AS 'receiver', SUM(case when aid = 1 then 1 else 0 end) eotm, SUM(case when aid = 2 then 1 else 0 end) eotw FROM award_winner INNER JOIN user_account R ON R.id = rid GROUP BY R.id ORDER BY last ASC`, (err, result) => {
      if(err) throw err;
    	console.log('./awardgivers: database found...');
      res.send(JSON.stringify(result));
    });
});

// awards by month
app.get('/monthlyawards', (req, res) => {
    mysql.pool.query(`SELECT COUNT(*) AS 'count', MONTH(date) AS 'month', YEAR(date) AS 'year' FROM award_winner GROUP BY month, year ORDER BY year, month ASC`, (err, result) => {
      if(err) throw err;
    	console.log('./awardgivers: database found...');
      res.send(JSON.stringify(result));
    });
});


// -- USER DASHBOARD ROUTES --

// list all awards
app.get('/listawards', (req, res) => {

    //mysql.pool.query(`SELECT W.id, T.type AS 'awardType', CONCAT(R.fname, ' ', R.lname) AS 'recipient', CONCAT(G.fname, ' ', G.lname) AS 'grantedBy', DATE_FORMAT(W.date, "%m-%d-%Y") AS 'dateGiven'
    //                  FROM award_winner W
    //                  INNER JOIN award_type T ON T.id = W.aid
    //                  INNER JOIN user_account R ON R.id = W.rid
    //                  INNER JOIN user_account G ON G.id = W.gid`, (err, result) => {

    //Include awards given/earned by deleted user
    mysql.pool.query(`SELECT W.id, T.type AS 'awardType', W.recipient, W.giver AS 'grantedBy', DATE_FORMAT(W.date, "%m-%d-%Y") AS 'dateGiven'
                      FROM award_winner W
                      INNER JOIN award_type T ON T.id = W.aid`, (err, result) => {
      if(err) throw err;
      //displays result in browser
      res.send(result);
      console.log('/listawards - database found...');
    });
});

// list awards for user_id:params
app.get('/listawards/:id', (req, res) => {
    mysql.pool.query(`SELECT W.id, T.type AS 'awardType', CONCAT(R.fname, ' ', R.lname) AS 'recipient', CONCAT(G.fname, ' ', G.lname) AS 'grantedBy', DATE_FORMAT(W.date, "%m-%d-%Y") AS 'dateGiven'
                      FROM award_winner W
                      INNER JOIN award_type T ON T.id = W.aid
                      INNER JOIN user_account R ON R.id = W.rid
                      INNER JOIN user_account G ON G.id = W.gid
                      WHERE W.gid=${req.params.id}`, (err, result) => {
      if(err) throw err;
    	console.log('/listawards/:id...database found...');
    	res.send(result);
    });
});

// Award Candidate exclude login user
app.get('/listcandidate/:id', (req, res) => {
    mysql.pool.query(`SELECT id, fname, lname, email, signature FROM user_account WHERE id<>${req.params.id}`, (err, result) => {
      if(err) throw err;
      console.log('./listcandidate: database found...');
      res.send(JSON.stringify(result));
    });
});

// add an award
app.post('/listawards/add', (req, res) => {
    let awd = req.body;
    //console.log(req.body);

    mysql.pool.query(`SELECT CONCAT(fname, ' ', lname) AS recipient FROM user_account WHERE id=?`,
      [awd.rid], (err, result) => {
        if(err) {
          //console.log(err);
          res.status(422).end();
        }
        let recipient = result[0].recipient;

        mysql.pool.query(`SELECT CONCAT(fname, ' ', lname) AS giver FROM user_account WHERE id=?`,
          [awd.gid], (err, result) => {
            if(err) {
              //console.log(err);
              res.status(422).end();
            }
            let giver = result[0].giver;

            mysql.pool.query("INSERT INTO award_winner (`rid`, `gid`, `aid`, `date`, `time`, `recipient`, `giver`) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [awd.rid, awd.gid, awd.aid, awd.date, awd.time, recipient, giver], (err, result) => {
              if(err) {
                //console.log(err);
                res.status(422).end();
              }
              //Send the data to client
              mysql.pool.query(`SELECT W.id, T.type AS 'awardType', G.signature, CONCAT(R.fname, ' ', R.lname) AS 'recipient', R.email AS 'email', CONCAT(G.fname, ' ', G.lname) AS 'grantedBy', DATE_FORMAT(W.date, '%m-%d-%Y') as 'dateGiven'
                              FROM award_winner W
                              INNER JOIN award_type T ON T.id = W.aid
                              INNER JOIN user_account R ON R.id = W.rid
                              INNER JOIN user_account G ON G.id = W.gid
                              WHERE W.id=?`, [result.insertId], function(err, result){
                  if(err){
                      next(err);
                      return;
                  }

                  //Convert to string before sending to client
                  res.send(JSON.stringify(result[0]));
                });
              });
      });
    });
});

// delete an award
app.get('/listawards/delete/:id', (req, res) => {
    mysql.pool.query(`DELETE FROM award_winner WHERE id=${req.params.id}`, (err, result) => {

      if(!err) {
    	   console.log('listawards/delete...delete successful.');
         res.status(202).end();
      }
      else
        console.log(err);
    });
});

//Email
var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'cs467erp@gmail.com',
        pass: 'cs467w2019'
    }
});

//Certificate
app.post('/cert', (req, res) => {
  const mailOptions = {
    from: '"Kang Industries" <cs467erp@email.com>', // sender address
    to: req.body.email, // list of receivers
    subject: 'Certificate of Achievement', // Subject line
    html: `<p>Congratulations ${req.body.recipient},</p>
           <p>You have been selected the ${req.body.awardType} by ${req.body.giver}.</p>
           <p>Sincerely,<br>Kang Industries</p>
           `,// plain text body
    attachments: [
      {
        path: req.body.body,
        encoding: 'base64',
        contentType: 'application/pdf',
        filename: 'certificate.pdf'
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
        res.status(422).end();
    }
    //console.log("Email Sent to: ", req.body.email);
    res.status(202).end();

    transporter.close();
  });
});


//forgot password
app.post('/forgotpw', (req, res) => {
  //console.log(req.body.email);

  mysql.pool.query(`SELECT * FROM user_account WHERE email=?`,
    [req.body.email], (err, result) => {
      if(err) {
        //console.log("POST request error");
        res.status(422).end();
      }
      else if(!result[0]) {
        //console.log('user not found');
        res.status(422).end();
      }
      else {
        //console.log(`user found`);

        var user = {
          "id": result[0].id,
          "fname": result[0].fname,
          "lname": result[0].lname,
          "email": result[0].email
        }

        //generate temp password
        var password = generator.generate({
            length: 10,
            numbers: true
        });

        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(password, salt, function(err, hash){
            if(err){
              console.log(err);
            }
            newUpdatedPword = hash;

            //console.log("Temp PW: ", password);

            mysql.pool.query("UPDATE user_account SET pword=? WHERE id=? ",
            [newUpdatedPword, user.id], function(err, result){
              if(err){
                res.status(422).end();
              }

              console.log("Update success..");

              const mailOptions = {
                from: '"Kang Industries" <cs467erp@email.com>', // sender address
                to: user.email,
                subject: 'Password Recovery', // Subject line
                html: `<p>Hi ${user.fname} ${user.lname},</p>
                    <p>Here's your temp password: ${password}</p>
                    <p>Please go to Edit Profile to change your password.</p>
                    `,// plain text body
                  };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
                res.status(422).end();
              }
              //console.log("Email Sent to: ", user.email);
              res.status(202).end();

              transporter.close();
            });
          });
        });
      });
    }
  });
});

app.listen(app.get('port'), function(){
    //console.log('Express started on http://flipX.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
