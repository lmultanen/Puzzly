import React from "react";
import {Link} from "react-router-dom";

const Nav = () => {
    return(
        <div id="navbar">
            <Link to="/"><span id="homeLink">Puzzly</span></Link>
            <div id="navbarRight">
                <Link to="/rules"><img className="navIcon" src="/question-mark.svg"/></Link>
                <Link to="/leaderboard"><img className="navIcon" src="/leaderboard.svg"/></Link> 
                <Link to="/settings"><img className="navIcon" src="/settings.svg"/></Link>
            </div>
        </div>
    )
}

export default Nav;

// - make a logo to put on the home page
// - then, should be ready to deploy and test on mobile
// ---- check if need to disable hover functionality on mobile devices
// - seed a couple hundred images
// - could add a play link on leaderboard page for signed in users
// --- if they haven't played current day's puzzly, show them a play link in time column
// ---- don't need to build out admin stuff until after launch
// ---- could later add in a setting to disable wiggle