import React from "react";
import {Link} from "react-router-dom";

const Nav = () => {
    return(
        <div id="navbar">
            <Link to="/"><span id="homeLink">Puzzly</span></Link>
            {/* <Link to="/play">Play</Link> */}
            <div id="navbarRight">
                <Link to="/rules"><img className="navIcon" src="/question-mark.svg"/></Link>
                <Link to="/leaderboard"><img className="navIcon" src="/leaderboard.svg"/></Link> 
                <Link to="/settings"><img className="navIcon" src="/settings.svg"/></Link>
            </div>
        </div>
    )
}

export default Nav;

// after reworking nav bar by removing the Play tab and left postition puzzly, right positioning rules/leaderboard with icons
// - flesh out rules page
// - could add a play link on leaderboard page for signed in users
// --- if they haven't played current day's puzzly, show them a play link in time column
// - add front end validation to Sign up form; hook up back end modal as well
// - then, should be ready to deploy and test on mobile
// - seed a couple hundred images
// - make a logo to put on the home page
// - flesh out the share text further
// - better align the nav icons
// - better style the win modal stats at least
// ---- check playthrough with tile bank fixed height

// - add basic settings page maybe; would have to think about how to link in to places
// - add a user seed file to .gitignore with admin permissions
// ---- don't need to build out admin stuff until after launch
// 