const Sequelize = require('sequelize');
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtStr = process.env.JWT || 'dummyString';
const saltRounds = Number(process.env.SALT || 8);
const UserResult = require('./UserResult')

// just building out basic fields for now
// first iteration will not have user functionality, will build out later

const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isAlphanumeric: {
                args: true,
                msg: "Username only permits alphanumeric characters."
            },
            len: {
                args: [4,32],
                msg: "Username must be between 4 and 32 characters."
            }
        },
        set(value) {
            this.setDataValue('username', value.toLowerCase());
          },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    completed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    lastCompleted: {
        type: Sequelize.INTEGER
    },
    completedStreak: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    lastTime: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    avgTime: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    // will just keep track of whether user used a hint for most recent puzzly, for stat display purposes
    usedHint: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
    // may need further fields later, but these are at least the ones that will be used in localStorage at first
})

// can also add in admin middleware, etc to api routes to use later
// - first iteration: will not need any admin functionality, but will build out later for myself to add new images
// - will also allow me to make other users an admin

// once log in and stuff in place, then write out some methods, such as adding/removing friends
// build out a method for adding local storage data into user data
// -- may want to build out robustly, where only tries to make a line item for history if user doesn't already have one for that puzzly number already
// build out methods like calculate average time, calculate streak, etc

// once those in place/tested, can then build out the user slice for the store
// - will want to slightly Play to check if a User is logged in; will have checks in update stats function for that if so
// 

//authentication
User.prototype.generateToken = function () {
    // ENSURE LATER THAT jwtStr IS APPROPRIATELY READING FOR .ENV FILE
    return jwt.sign({ id: this.id }, jwtStr);
  };  

User.byToken = async (token) => {
    try {
      jwt.verify(token, jwtStr);
      const user = await User.findByPk(
        jwt.decode(token).id,
        {
            attributes: {
                exclude: ["password"]
            }
        }
      );
      if (user) {
        return user;
      }
      const error = Error('bad credentials');
      error.status = 401;
      throw error;
    } catch (err) {
      const error = Error('bad credentials');
      error.status = 401;
      throw error;
    }
};
  
User.decodeToken = async (token) => {
    try {
      jwt.verify(token, jwtStr);
      return jwt.decode(token).userId;
    } catch (err) {
      const error = Error('bad credentials');
      error.status = 401;
      throw error;
    }
};

User.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
  });

User.authenticate = async ({ username, password }) => {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
        const error = Error(' Invalid Username ');
        error.status = 401;
        throw error;
    } else if (!(await bcrypt.compare(password, user.password))) {
        const error = Error('Incorrect password');
        error.status = 401;
        throw error;
    }
    return user;
};

// could add a variable with currentPuzzlyNumber? could then update other fields like currenttime, etc, hintUsed
// or, just will send an object with all variables to update later in front end
// or, will create separate addCurrentResult method and just use this one for loading local storage results
User.prototype.addResult = async (puzzlyNumber, time) => {
    // may want to first check that User doesn't already have a result for this puzzlyNumber
    await UserResult.create({puzzlyNumber: puzzlyNumber, time: time, userId: this.id})
    this.completed += 1;
    await this.update();
}

User.prototype.loadLocalStorageResults = async (localResults) => {
    const results = await this.getResultHistory();
    for (let localResult of localResults) {
        if (!results.filter(result => result.puzzlyNumber === localResult.puzzlyNumber).length) {
            this.addResult(localResult.puzzlyNumber, localResult.time)
        }
    }
}

User.prototype.getResultHistory = async () => {
    const resultHistory = await UserResult.findAll({
        where: {
            userId: this.id
        }
    })
    return resultHistory;
}

User.prototype.updateCurrentStreak = async function (currentPuzzlyNum) {
    // const results = await this.getResultHistory();
    // // could also just try to search for a userResult with puzzlyNumber (currentPuzzlyNum-1) with userId
    // // - could reduce potential latency issues down the road
    // if (results.filter(result => result.puzzlyNumber === currentPuzzlyNum-1).length) {
    //     this.completedStreak += 1;
    // }
    // else {
    //     this.completedStreak = 1;
    // }
    // await this.update();
    // console.log(lastCompleted, currentPuzzlyNum)
    // console.log('will break here')
    if (this.lastCompleted === currentPuzzlyNum - 1) {
        this.completedStreak += 1;
    }
    else {
        this.completedStreak = 1;
    }
    this.lastCompleted = currentPuzzlyNum
    await this.save()
}

User.prototype.addCurrentResult = async function (puzzlyNumber, time, usedHint) {
    // const user = await User.findByPk(id)
    await UserResult.create({puzzlyNumber: puzzlyNumber, time: time, usedHint: usedHint, userId: this.id})
    let newAvgTime = Math.floor((this.avgTime*this.completed + time) / (this.completed + 1))
    this.avgTime = newAvgTime
    await this.updateCurrentStreak(puzzlyNumber)
    this.completed += 1;
    this.lastTime = time;
    this.usedHint = usedHint;
    await this.save()
    return this;
}

// friend methods
User.prototype.addFriendByUsername = async function (username) {
    const friend = await User.findOne({
        where: {
            username: username.toLowerCase()
        }
    }); 
    if (friend) {
        await this.addFriend(friend)
    }
}

// should be able to pass in friend model directly from front end
// - if not, will refactor to pass in an id or username and find the User before removing
User.prototype.removeFromFriendList = async function (friendId) {
    const friendToRemove = await User.findByPk(friendId)
    await this.removeFriend(friendToRemove)
}

// might not even need this, can make sure to include User model as friend on front end and get that way
User.prototype.getFriendsList = async function (){
    const selfWithFriends = await User.findByPk(this.id, {
        include: {
            model: User,
            as: "Friend"
        }
    })
    return selfWithFriends.friends;
}

User.prototype.getFriendsPuzzlyResults = async function (puzzlyNumber) {
    const selfWithFriendsResults = await User.findByPk(this.id, {
        include: {
            model: User,
            as: "Friend",
            include: {
                model: UserResult, 
                where: {
                    puzzlyNumber: puzzlyNumber
                }
            }
        }
    })
    // this won't give it in easily accessed array, but can dive into each and grab
    // may then later want to sort these results for display purposes, but could always do that elsewhere
    return selfWithFriendsResults;
}

// order of operations on front end: trigger stat update, which will add most recent result
// - will then call updateCurrentStreak and calculateAverageTime once result added

module.exports = User;