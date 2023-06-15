const Sequelize = require('sequelize');
const db = require('../db');

const Image = db.define('image', {
    imageUrl: {
        type: Sequelize.STRING,
        defaultValue: 'https://fastly.picsum.photos/id/649/200/200.jpg?hmac=tj148mYv7Me5ctSyCePc_TNjma4W3n3RwnqJcIogLoI'
    }
})

module.exports = Image;