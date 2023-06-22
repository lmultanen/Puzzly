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

// methods for adding local storage results
User.prototype.addResult = async function (puzzlyNumber, time, usedHint) {
    // may want to first check that User doesn't already have a result for this puzzlyNumber
    await UserResult.create({puzzlyNumber: puzzlyNumber, time: time, userId: this.id, usedHint: usedHint})
    this.completed += 1;
    if (puzzlyNumber > this.lastCompleted) {
        this.lastCompleted = puzzlyNumber
    }
    let newAvgTime = Math.floor((this.avgTime*this.completed + time) / (this.completed + 1))
    this.avgTime = newAvgTime

    await this.save();
}

User.prototype.loadLocalStorageResults = async function (localResults) {
    const results = await this.getResultHistory();
    for (let localResult of localResults) {
        if (!results.filter(result => result.puzzlyNumber === localResult.puzzly).length) {
            await this.addResult(localResult.puzzly, localResult.time, localResult.usedHint ? true : false)
        }
    }
    return this;
}

User.prototype.getResultHistory = async function () {
    const resultHistory = await UserResult.findAll({
        where: {
            userId: this.id
        }
    })
    return resultHistory;
}
// recalculates streak; called after loading local storage results
User.prototype.calculateStreak = async function (currentPuzzlyNum) {
    const orderedResults = await UserResult.findAll({
        where: {
            userId: this.id
        },
        order: [["puzzlyNumber", "DESC"]]
    })
    if (!orderedResults.length) {
        return await User.findByPk(this.id, {
            attributes: {
                exclude: ["password"]
            }
        });
    }
    this.lastTime = orderedResults[0].time;
    this.lastCompleted = orderedResults[0].puzzlyNumber
    // console.log(orderedResults[0].time,orderedResults[0].puzzlyNumber)
    if (currentPuzzlyNum !== orderedResults[0].puzzlyNumber) {
        this.completedStreak = 0;
    }
    else {
        let streak = 1;
        let puzzNum = currentPuzzlyNum-1;
        for (let i=1; i<orderedResults.length; i++) {
            if (orderedResults[i].puzzlyNumber === puzzNum) {
                streak++;
                puzzNum--;
            }
            else {
                break;
            }
        }
        this.completedStreak = streak
    }
    await this.save()

    return await User.findByPk(this.id, {
        attributes: {
            exclude: ["password"]
        }
    });
    // return this after updating streak field
}

// relies on streak field being up to date
User.prototype.updateCurrentStreak = async function (currentPuzzlyNum) {
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
        },
        attributes: {
            exclude: ["password"]
        }
    }); 
    if (friend) {
        await this.addFriend(friend)
    }
}

// should be able to pass in friend model directly from front end
// - if not, will refactor to pass in an id or username and find the User before removing
User.prototype.removeFromFriendList = async function (friendId) {
    const friendToRemove = await User.findByPk(friendId, {
        attributes: {
            exclude: ["password"]
        }
    })
    await this.removeFriend(friendToRemove)
}

// might not even need this, can make sure to include User model as friend on front end and get that way
User.prototype.getFriendsList = async function (){
    const selfWithFriends = await User.findByPk(this.id, {
        attributes: {
            exclude: ["password"]
        },
        include: {
            model: User,
            as: "Friend"
        }
    })
    return selfWithFriends.friends;
}

User.prototype.getFriendsPuzzlyResults = async function (puzzlyNumber) {
    const selfWithFriendsResults = await User.findByPk(this.id, {
        attributes: {
            exclude: ["password"]
        },
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