const db = require('./db')
const User = require('./models/User')
const Image = require('./models/Image')
const seedFunc = require('./seed')
const UserResult = require('./models/UserResult')

User.belongsToMany(User, { as: 'Friend', through: 'UserFriend'})

User.hasMany(UserResult)
// UserResult.belongsTo(Image)

module.exports = {
    db,
    User,
    Image,
    UserResult,
    seedFunc
}