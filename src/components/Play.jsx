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