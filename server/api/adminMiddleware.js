const sequelize = require('sequelize');
const { User } = require('../db');

//user must be an admin
const isAdmin = async (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) {
		res.status(403).send('Unauthorized access');
	}
	const user = await User.byToken(token)
	if (!user.isAdmin) {
		res.status(403).send('Unauthorized access');
	} else {
		next();
	}
};

module.exports = {
	isAdmin,
};
