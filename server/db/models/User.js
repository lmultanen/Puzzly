const Sequelize = require('sequelize');
const db = require('../db');

// just building out basic fields for now
// first iteration will not have user functionality, will build out later

const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        },
        set(value) {
            this.setDataValue('username', value.toLowerCase());
          },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    completed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    lastCompleted: {
        type: Sequelize.INTEGER
    },
    completedStreak: {
        type: Sequelize.INTEGER
    },
    lastTime: {
        type: Sequelize.INTEGER
    },
    avgTime: {
        type: Sequelize.INTEGER
    }
    // may need further fields later, but these are at least the ones that will be used in localStorage at first
})

// will later fill out instance and prototype methods, such as for user auth, adding/removing friends, and updating stats

module.exports = User;