import React from "react";
import {Link} from "react-router-dom";

const Nav = () => {
    return(
        <div id="navbar">
            <Link to="/">Puzzly</Link>
            <Link to="/play">Play</Link>
            <Link to="/rules">Rules</Link>
            <Link to="/leaderboard">Leaderboard</Link> 
            {/* find icons for rules and leaderboard; question mark and podium */}

            {/* may remove Play and Rules from navbar and just have Puzzly (for now)
                would later add in stuff like a leaderboard/login icon to nav bar and keep the Play and Rules buttons on the home page
            */}
        </div>
    )
}

export default Nav;

// local storage for puzzly results:
/*
{completed: int, lastCompleted: int, streak: int, avgTime: int}
- completed will be total Puzzly's completed. incremented by 1 after completing current day's Puzzly 
- lastCompleted should be the ID of last Puzzly completed. 
-- After completing a puzzly, will run a method to check if user's lastCompleted puzzly ID is 1 less than current puzzly.
-- If so, will increment streak by 1. Else, set streak to 1 and set lastCompleted to current puzzly ID
- streak will just be active puzzly streak
- avgTime will be average time of puzzly solve times, rounded to nearest integer, in seconds.
-- will recalculate value after completing current day's puzzly by multiplying avgTime by completed (before incremented), adding current days time in seconds, then dividing and rounding to nearest int


These above fields will likely also be stored in the User model sql table. Will need a method to convert local storage (if exists) to a user's profile after they sign up
*/