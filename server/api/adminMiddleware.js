const sequelize = require('sequelize');
const { User } = require('../db');

//user must be an admin
const isAdmin = async (req, res, next) => {
	// const token = window.localStorage.getItem('puzzlyToken')
	// making sure this fails; will write out admin functionality in next iteration
	// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg3NTU1NTUxfQ.Uns4kVyeQJWCFfexVFUulVJuEeha2YTptdPiM8aL1wE'
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
