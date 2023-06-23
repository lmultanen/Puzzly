const db = require('../db');
const images = require('./imageSeed');
const users = require('./userSeed');
const Image = require('../models/Image');
const User = require('../models/User')

const seed = async () => {
    console.log('Seeding in progress...')
    await db.sync({ force: true })
    await Promise.all(images.map(image => Image.create({imageUrl: image.url})))
    await Promise.all(users.map(user => User.create(user)))
}

module.exports = seed;