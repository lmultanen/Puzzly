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

// after reworking nav bar by removing the Play tab and left postition puzzly, right positioning rules/leaderboard with icons
// - flesh out rules page
// - add front end validation to Sign up form; hook up back end modal as well
// - then, should be ready to deploy and test on mobile
// - seed a couple hundred images
// - add a user seed file to .gitignore with admin permissions
// ---- don't need to build out admin stuff until after launch