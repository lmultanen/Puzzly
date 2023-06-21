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
    },
    usedHint: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = UserResult