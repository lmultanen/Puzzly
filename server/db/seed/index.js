const db = require('../db');
const images = require('./imageSeed');
// may later have a user seed, tbd
const Image = require('../models/Image')

const seed = async () => {
    console.log('Seeding in progress...')
    await db.sync({ force: true })
    await Promise.all(images.map(image => Image.create({imageUrl: image.url})))
}

module.exports = seed;