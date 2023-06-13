import React, { useState, useEffect } from "react";
import SolveGrid from "./SolveGrid.jsx";
import TileBank from "./TileBank.jsx";

const Play = () => {
    // will likely need several useEffects/useStates
    // for one, will want something to check if user has already completed the day's puzzly
    // for starters, will check a bool or something in local storage.
    // if not completed and saved time is 0, then start incremmenting from 0. otherwise, will pick up timer from saved value
    // if completed, pop up a module or something giving user option to share time

    const [timer, setTimer] = useState(0);
    const [completed, setCompleted] = useState(false);
    // will figure out how best to use/store a completed bool

    // going to use a state for determining how many tiles in tile bank still
    // will want to initially set in initial useEffect:
    // - however, now the issue of how to store which tiles already been placed/etc
    // - will get to that persistence issue later
    const [remainingTiles, setRemainingTiles] = useState([])
    const tiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]

    const [selectedTile, setSelectedTile] = useState(null)
    const [updateGridValue, setUpdateGridValue] = useState(null)

    // might be able to json stringify/parse remaining tiles info to local storage?

    useEffect(() => {
        const currentTimer = Number(window.localStorage.getItem('currentTimer'));
        setTimer(currentTimer);
        // will need to figure out how best to update this as tiles are moved around
        setRemainingTiles(tiles);
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

    useEffect(() => {

    },[selectedTile])

    const bubbleUpSelected = (tile) => {
        setSelectedTile(tile);
        // console.log('selected tile bubbled up')
        // console.log(tile)
    }   

    const removeFromTileBank = (tileToRemove) => {
        // will need to change this when using img urls, etc.
        const removed = remainingTiles.filter(tile => tile != tileToRemove.textContent)
        console.log(removed)
        setRemainingTiles(removed)
    }

    // may need to modify if type changes at all
    const addToTileBank = (tileToAdd, selected) => {
        const added = [...remainingTiles, Number(tileToAdd)]
        const filtered = added.filter(tile => tile != selected?.textContent)
        setRemainingTiles(filtered)
    }

    const updateGridSquare = (value) => {
        setUpdateGridValue(value)
    }

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
            <SolveGrid selectedTile={selectedTile} bubbleUpSelected={bubbleUpSelected} removeFromTileBank={removeFromTileBank} addToTileBank={addToTileBank} updateGridValue={updateGridValue}/>
            <br/>
            <TileBank tiles={remainingTiles} selectedTile={selectedTile} bubbleUpSelected={bubbleUpSelected} addToTileBank={addToTileBank} updateGridSquare={updateGridSquare}/>
        </div>
    )
}

export default Play;

// SolveGrid might even be built from a bunch of inidividual Square components. Can then pass individual tiles to those as a prop