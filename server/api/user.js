const router = require('express').Router();
const Sequelize = require('sequelize');
const { User } = require('../db');
const { isAdmin } = require('./adminMiddleware');

//User account routes
router.get('/account', async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = await User.byToken(token)
        res.send(user)
    } catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const userData = { username: username, password: password };
      const user = await User.authenticate(userData);
      const token = await user.generateToken();
      res.send({ token });
    } catch (error) {
      next(error);
    }
});

router.post('/signup', async (req, res, next) => {
    try {
      const { username, password } =
        req.body;
      const user = await User.create({
        username,
        password
      });
      const token = await user.generateToken()
      res.send({token});
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('User already exists');
      } else {
        next(error);
      }
    }
});

// adding results
router.post('/addcurrentresult', async (req, res, next) => {
    try {
        const { result } = req.body;
        const user = await User.findByPk(result.userId);
        const updated = await user.addCurrentResult(result.puzzlyNumber, result.time, result.usedHint)
        res.send(updated)
    } catch (error) {
        next(error)
    }
})

router.get('/leaderboard', async (req, res, next) => {
    try {
        // will need to hook up appropriate params in userSlice.js
        const { puzzlyNumber } = req.body;
        const user = await User.byToken(req.headers.authorization)
        const userWithFriendsTimes = await user.getFriendsPuzzlyResults(puzzlyNumber)
        res.send(userWithFriendsTimes)
    } catch (error) {
        next(error)
    }
})

// will need to test these all out
router.put('/addfriend', async (req, res, next) => {
    try {
        const user = await User.byToken(req.headers.authorization)
        await user.addFriendByUsername(req.body.username)
        res.send("success")
    } catch (error) {
        next(error)
    }
})
// could have another User model method that notifies user when they've been added as friend and by whom?
// would then allow them to reciprically add friends
// or, could add them to both friends lists at same time? tbd

router.put('/removefriend/:friendid', async (req, res, next) => {
    try {
        const user = await User.byToken(req.headers.authorization)
        await user.removeFromFriendList(req.params.friendid)
        res.send("success")
    } catch (error) {
        next(error)
    }
})

router.get('/friends', async (req, res, next) => {
    try {
        const user = await User.byToken(req.headers.authorization)
        const friends = await user.getFriendsList();
        res.send(friends)
    } catch (error) {
        next(error)
    }
})

// admin functionality
router.get('/allusers',isAdmin, async (req, res, next) => {
    try {
        // get all admins; can paginate
        if (req.query.page) {
            const orderArr =
              req.query.sort === 'true'
                ? [Sequelize.fn('lower', Sequelize.col('username')), 'asc']
                : ['id', 'asc'];
            const { rows, count } = await User.findAndCountAll({
              order: [orderArr],
              offset: (req.query.page - 1) * 25,
              limit: 25,
            });
            res.send({ rows, count });
          } else {
            const { rows, count } = await User.findAndCountAll();
            res.send({ rows, count });
        }
    } catch (error) {
        next(error)
    }
})

// add an update user route
router.get('/allusers/:id', isAdmin, async (req, res, next) => {
    try {
        // fill out later, allow admins to see/update other user info
        // mainly will be used for isAdmin
    } catch (error) {
        next(error)
    }
})

router.put('/allusers/:id', isAdmin, async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
})


// could also add in a delete user account it need be

module.exports = router;