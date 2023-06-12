import React from "react";
import {Link} from "react-router-dom";

const Nav = () => {
    return(
        <div id="navbar">
            {/* <p>Placeholder for Navbar. Navbar should just contain 'Puzzly' and possibly logo in the center, and maybe a '?' on the side that links to the Rules page.</p>
            <p>Clicking on the 'Puzzly' text should link back to home page.</p>
            <p>Eventually, when adding friends/leaderboard, could have a little podium icon or something to show the leaderboard page</p>
            <p>Leaderboard page will have a link to search for and add friends.</p>
            <p>A requested friend will see friend requests on their leaderboard page that they can either accept or decline.</p>
            <p>That said, first iteration will be without Friends and Users. Will just use localstorage to keep track of user's results</p>
            <p>Once initial version done, will allow user's to create a username/password. Then, would need a 'log in' button on nav or home page.</p> 
            <p>Will set up db to accomodate a User table. Should be simple, with username, pword, isAdmin, etc</p> */}
            <Link to="/">Puzzly</Link>
            <Link to="/play">Play</Link>
            <Link to="/rules">Rules</Link>
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