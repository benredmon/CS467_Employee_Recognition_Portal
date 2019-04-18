// The Admin model.

var Sequelize = require('sequelize');
//var db = require('../db');
var db = require('../db_localhost');

// SOURCE: https://www.youtube.com/watch?v=bOHysWYMZM0
// SOURCE: https://stackoverflow.com/questions/21114499/how-to-make-sequelize-use-singular-table-names
const Admin = db.define('admin_account', {
  first_name: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  pword: {
    type: Sequelize.STRING
  },
  master: {
    type: Sequelize.TINYINT
  }
},
{
  timestamps: false,
  freezeTableName: true,
  tableName: 'admin_account'
})

module.exports = Admin;
