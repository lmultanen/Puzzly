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

    // will likely use a useSelector once redux set up to grab this value
    const [currentPuzzly, setCurrentPuzzly] = useState(2)
    // will grab this from localStorage to start if exists; later, could live in user db table

    const [remainingTiles, setRemainingTiles] = useState([])
    const [sequencedTiles, setSequencedTiles] = useState([]) // will have a bubble up method from SolveGrid to set this

    // will later need to generate these tiles/grab them from backend to pass to bank
    const tiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]

    const [selectedTile, setSelectedTile] = useState(null)
    const [updateGridValue, setUpdateGridValue] = useState(null)

    // will pass in baseGrid to SolveGrid
    // but first
    const baseGrid = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];

    const [savedGrid,setSavedGrid] = useState(null);

    useEffect(() => {
        const lastSavedCompleted = Number(window.localStorage.getItem('lastCompletedPuzzly'));
        
        if (lastSavedCompleted === currentPuzzly) {
            setTimer(Number(window.localStorage.getItem('lastCompletedPuzzlyTime')))
            setCompleted(true)
            // next step, spawn a pop up modal to allow user's to share time
            // TODO: make modal page.
            // - at very least, could redirect to new win page? but woudn't be as slick

            const completedGrid = JSON.parse(window.localStorage.getItem('completedPuzzlyGrid'));
            setSavedGrid(completedGrid)
        }
        else {
            window.localStorage.setItem('completedPuzzlyGrid',JSON.stringify(baseGrid));
            const currentTimer = Number(window.localStorage.getItem('currentPuzzlyTimer'));
            setTimer(currentTimer);

            const storedGrid = JSON.parse(window.localStorage.getItem('savedPuzzlyGrid'))
            if (storedGrid?.length === 4 && storedGrid[0].length === 4) {
                setSavedGrid(storedGrid)
            } else {
                setSavedGrid(baseGrid)
            }        
            const savedTiles = JSON.parse(window.localStorage.getItem('remainingPuzzlyTiles'))
            const storedSequence = JSON.parse(window.localStorage.getItem('sequencedPuzzlyTiles')) 

            if (savedTiles.length + storedSequence.length === 16) {
                setRemainingTiles(savedTiles);
                setSequencedTiles(storedSequence)
            } else {
                setRemainingTiles(tiles)
            }

            // edge case check for when user opens for first time at start of day
            // checking just for savedTiles 0 length with way storage is set up will throw a false negative
            if (savedTiles.length === 0 && storedSequence === 0) {
                checkWinCondition();
            }
        }
    },[])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!completed) {
                window.localStorage.setItem('currentPuzzlyTimer', `${timer+1}`);
                setTimer(timer+1);
            }
        },1000);
        return(() => {
            clearInterval(interval)
            
        })
    },[timer,completed])

    useEffect(() => {
    },[selectedTile])

    useEffect(() => {
        window.localStorage.setItem('remainingPuzzlyTiles',JSON.stringify(remainingTiles))
        window.localStorage.setItem('sequencedPuzzlyTiles',JSON.stringify(sequencedTiles))
        if (remainingTiles.length === 0 && sequencedTiles.length === 16) {
            checkWinCondition()
        }
    }, [remainingTiles.length, sequencedTiles.length, sequencedTiles])

    const checkTilesSequenced = () => {
        const arr = (sequencedTiles.length === 16) ? sequencedTiles : savedGrid?.flat().filter(val => val);
        console.log(arr)
        if (!arr || arr.length !== 16) {
            return false;
        }
        
        for (let i = 0; i < arr.length -1; i++) {
            // will need to modify check here; alternatively, can always just pass in tile id so long as they are sequenced appropriately
            if (arr[i] > arr[i+1]) {
                return false;
            }
        }
        return true;
    }

    const checkWinCondition = () => {
        // for now, since tiles just ordered by number, will check to see that they are sorted in order
        // later, will need to update/modify with object/model id or something
        if (checkTilesSequenced()) {
            setCompleted(true);
            // at later time, will look to update user's db
            // before that, can look to create some new stats as written out in a different component
            window.localStorage.setItem('lastCompletedPuzzly',`${currentPuzzly}`);
            window.localStorage.setItem('lastCompletedPuzzlyTime',`${timer}`)
            window.localStorage.setItem('currentPuzzlyTimer','0')
            window.localStorage.setItem('completedPuzzlyGrid',JSON.stringify(savedGrid))
            window.localStorage.setItem('savedPuzzlyGrid',JSON.stringify(baseGrid))

            console.log(`You completed Puzzly ${currentPuzzly} in ${timer} seconds!`)
        } else {
            console.log("Hmm... something is out of place. Keep trying!")
        }
    }

    const bubbleUpGrid = (arr2d) => {
        // save grid to local storage here
        window.localStorage.setItem('savedPuzzlyGrid', JSON.stringify(arr2d))
        setSavedGrid(arr2d)

        const flattened = arr2d.flat()
        const arr = flattened.filter(val => val)
        setSequencedTiles(arr);
    }

    const bubbleUpSelected = (tile) => {
        setSelectedTile(tile);
    }   

    const removeFromTileBank = (tileToRemove) => {
        // will need to change this when using img urls, etc.
        const removed = remainingTiles.filter(tile => tile != tileToRemove.textContent)
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
            <h2>Puzzly #{currentPuzzly}</h2>
            <h4>Timer: {timer}s</h4>
            <SolveGrid selectedTile={selectedTile} bubbleUpSelected={bubbleUpSelected} removeFromTileBank={removeFromTileBank} addToTileBank={addToTileBank} updateGridValue={updateGridValue} bubbleUpGrid={bubbleUpGrid} savedGrid={savedGrid} completed={completed}/>
            <br/>
            <TileBank tiles={remainingTiles} selectedTile={selectedTile} bubbleUpSelected={bubbleUpSelected} addToTileBank={addToTileBank} updateGridSquare={updateGridSquare}/>
        </div>
    )
}

export default Play;