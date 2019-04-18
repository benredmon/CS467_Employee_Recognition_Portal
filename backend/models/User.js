// The User model.

var Sequelize = require('sequelize');
//var db = require('../db');
var db = require('../db_localhost');

// SOURCE: https://www.youtube.com/watch?v=bOHysWYMZM0
// SOURCE: https://stackoverflow.com/questions/21114499/how-to-make-sequelize-use-singular-table-names
const User = db.define('user_account', {
  fname: {
    type: Sequelize.STRING
  },
  lname: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  pword: {
    type: Sequelize.STRING
  },
  signature: {
    type: Sequelize.STRING
  }
},
{
  timestamps: false,
  freezeTableName: true,
  tableName: 'user_account'
})

module.exports = User;
