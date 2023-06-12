import React, { useState, useEffect } from "react";
import SolveGrid from "./SolveGrid.jsx";

const Play = () => {
    // will likely need several useEffects/useStates
    // for one, will want something to check if user has already completed the day's puzzly
    // for starters, will check a bool or something in local storage.
    // if not completed and saved time is 0, then start incremmenting from 0. otherwise, will pick up timer from saved value
    // if completed, pop up a module or something giving user option to share time

    const [timer, setTimer] = useState(0);
    const [completed, setCompleted] = useState(false);
    // will figure out how best to use/store a completed bool

    useEffect(() => {
        const currentTimer = Number(window.localStorage.getItem('currentTimer'));
        setTimer(currentTimer);
    },[])

    useEffect(() => {
        // need a way to check if current day's has been completed
        // once it is completed, then will need to reset stored time, bool/other object, and update user stats
        const interval = setInterval(() => {
            window.localStorage.setItem('currentTimer', `${timer+1}`);
            setTimer(timer+1);
        },1000);
        return(() => {
            clearInterval(interval)
            
        })
    },[timer])

    return(
        // <div>
        //     <h2>Placeholder for the Play page</h2>
        //     <p>This page will consist of two main sections: the Solve Grid and the Tile Bank, which will be stacked on top of each other.</p>
        //     <p>The Solve Grid will be a (likely) 4x4 grid with a slight margin between each slot and a faint outline for each slot.</p>
        //     <p>The Tile Bank will display the unplaced tiles. Users will be able to select a tile by tapping it and then placing it by tapping a square in the Solve Grid.</p>
        //     <p>Once the player has placed all tiles in the Solve Grid, if the order is correct, they will have completed that day's Puzzly.</p>
        //     <p>If the order is incorrect, have some text appear below the Solve Grid explaining "hmm... some tiles seem to be out of order" and outline the Solve Grid in red.</p>
        //     <p>There should be a timer counting up from 0 seconds (and into minutes) at the top of the screen. Completed the Puzzly will cause the timer to stop and a pop up modal should congratulate the player and allow them to share their result by clicking a share button.</p>
        //     <p>Clicking said 'share' button should copy to the player's clipboard a message like "I solved Puzzly #3 in 43 seconds" and then maybe include a link to the puzzly site as well at the end.</p>
        // </div>
        <div id="playPage">
            <div className="nav-buffer"/>
            <h2>Puzzly #1</h2>
            <h4>Timer: {timer}s</h4>
            <SolveGrid/>
        </div>
    )
}

export default Play;

// first things first: make a SolveGrid component and a tile bank component
// will then stack them on top of each other here
// SolveGrid might even be built from a bunch of inidividual Square components. Can then pass individual tiles to those as a prop