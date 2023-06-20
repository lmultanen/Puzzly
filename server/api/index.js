const router = require('express').Router();

// router.use('/template', require('./template'));
router.use('/image', require('./image'));
router.use('/user', require('./user'));

// later add in admin functionality

module.exports = router;