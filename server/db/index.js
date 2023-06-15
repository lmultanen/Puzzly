const db = require('./db')
const User = require('./models/User')
const Image = require('./models/Image')
const seedFunc = require('./seed')

User.belongsToMany(User, { as: 'Friend', through: 'UserFriend'})

module.exports = {
    db,
    User,
    Image,
    seedFunc
}