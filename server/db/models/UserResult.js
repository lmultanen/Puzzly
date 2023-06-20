const Sequelize = require('sequelize');
const db = require('../db');

const UserResult = db.define('userResult', {
    puzzlyNumber: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: true
            }
    },
    time: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: true
        }
    }
})

module.exports = UserResult