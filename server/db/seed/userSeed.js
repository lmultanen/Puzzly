require('dotenv').config();


const users = [
    {
        username: process.env.admin_name ? process.env.admin_name : "dummyAdmin",
        password: process.env.admin_password ? process.env.admin_password : "dummyAdminPass",
        isAdmin: true
    }
]

module.exports = users;