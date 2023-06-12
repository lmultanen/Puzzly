import React, { useEffect } from "react";

const Home = () => {
    useEffect(() => {
        const currentTimer = window.localStorage.getItem('currentTimer');
        if (!currentTimer) {
            window.localStorage.setItem('currentTimer', '0');
        }
    },[])

    return(
        <div id="home-container">
            <div className="nav-buffer"/>
            <h2>Placeholder home page. Will later add a couple buttons (at least), one of which takes users to a page or opens a popup for the Rules, and the other takes users to the 'Play' page, where they will be able to solve the day's Puzzly.</h2>
        </div>
    );
}

export default Home;