const sequelize = require('sequelize');
const { User } = require('../db');

//user must be an admin
const isAdmin = async (req, res, next) => {
	if (!req.user.isAdmin) {
		res.status(403).send('must have correct privileges');
	} else {
		next();
	}
};

module.exports = {
	isAdmin,
};
