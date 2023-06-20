import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SolveGrid from "./SolveGrid.jsx";
import TileBank from "./TileBank.jsx";
import HintModal from "./HintModal.jsx";
import WinModal from "./WinModal.jsx";
import { fetchCurrentPuzzlyNumber, fetchPuzzlyImageUrl, fetchTotalPuzzlyCount } from "../store/slices/imageSlice.js";

const Play = () => {
    const dispatch = useDispatch();

    const [timer, setTimer] = useState(0);
    const [completed, setCompleted] = useState(false);

    const currentPuzzlyNum = useSelector(state => state.image.puzzlyNumber)
    const totalPuzzlyCount = useSelector(state => state.image.totalPuzzlyCount)

    const [remainingTiles, setRemainingTiles] = useState([])
    const [sequencedTiles, setSequencedTiles] = useState([]) // will have a bubble up method from SolveGrid to set this

    const [selectedTile, setSelectedTile] = useState(null)
    const [updateGridValue, setUpdateGridValue] = useState(null)

    const baseGrid = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];

    const [savedGrid,setSavedGrid] = useState(null);

    const imgUrl = useSelector(state => state.image.imgUrl)

    const [showHintModal, setShowHintModal] = useState(null);
    const [usedHint, setUsedHint] = useState(false);

    const [showWinModal, setShowWinModal] = useState(false);

    const [readyToRender, setReadyToRender] = useState(false);

    // will need to set this with a user 'get puzzly history' if user logged in later
    // - will also have a 'save puzzly history' for new users who log in with a local history
    // - after that, should reset the saved history
    const [puzzlyHistory, setPuzzlyHistory] = useState([]);
    const [averageTime, setAverageTime] = useState(null);
    const [streak, setStreak] = useState(null);

    const [errorPopup, setErrorPopup] = useState(false)

    useEffect(() => {
        dispatch(fetchCurrentPuzzlyNumber())
        dispatch(fetchTotalPuzzlyCount())
    },[])

    useEffect(() => {
        if (currentPuzzlyNum && totalPuzzlyCount) {
            let puzzlyId = (currentPuzzlyNum) % (totalPuzzlyCount)
            if (puzzlyId === 0) {
                puzzlyId = totalPuzzlyCount;
            }
            dispatch(fetchPuzzlyImageUrl(puzzlyId))
        }
    }, [currentPuzzlyNum,totalPuzzlyCount])

    useEffect(() => {
        const lastSavedCompleted = Number(window.localStorage.getItem('lastCompletedPuzzly'));
        const localPuzzlyHistory = JSON.parse((window.localStorage.getItem('puzzlyHistory')));
        const savedAverageTime = Number(window.localStorage.getItem('averagePuzzlyTime'));
        const savedPuzzlyStreak = Number(window.localStorage.getItem('puzzlyStreak'));
        setStreak(savedPuzzlyStreak)
        if (localPuzzlyHistory) {
            setPuzzlyHistory(localPuzzlyHistory)
            setAverageTime(savedAverageTime)
        }

        if (window.localStorage.getItem('usedHint') === 'true') {
            setUsedHint(true)
        }

        if (imgUrl && currentPuzzlyNum) {
            if (lastSavedCompleted === currentPuzzlyNum) {
                setTimer(Number(window.localStorage.getItem('lastCompletedPuzzlyTime')))
                setCompleted(true)
    
                const completedGrid = JSON.parse(window.localStorage.getItem('completedPuzzlyGrid'));
                // also load stats here

                const savedAverageTime = Number(window.localStorage.getItem('averagePuzzlyTime'));
                const savedPuzzlyHistory = JSON.parse(window.localStorage.getItem('puzzlyHistory'));
                setAverageTime(savedAverageTime);
                setPuzzlyHistory(savedPuzzlyHistory)
                

                setSavedGrid(completedGrid)
                openWinModal()
            }
            else {
                window.localStorage.setItem('completedPuzzlyGrid',JSON.stringify(baseGrid));
                const currentTimer = Number(window.localStorage.getItem('currentPuzzlyTimer'));
                setTimer(currentTimer);
                

                const storedGrid = JSON.parse(window.localStorage.getItem('savedPuzzlyGrid'))
                const savedTiles = JSON.parse(window.localStorage.getItem('remainingPuzzlyTiles'))
                const storedSequence = JSON.parse(window.localStorage.getItem('sequencedPuzzlyTiles')) 


                if (checkSavedTilePuzzlyId(grabSavedTile(storedGrid,savedTiles))) {
                    if (savedTiles?.length !== 16) {
                        setSavedGrid(storedGrid)
                    } else {
                        setSavedGrid(baseGrid)
                    }        
                    if (savedTiles?.length + storedSequence?.length === 16) {
                        setRemainingTiles(savedTiles);
                        setSequencedTiles(storedSequence)
                    } 
                    // edge case check for when user opens for first time at start of day
                    // checking just for savedTiles 0 length with way storage is set up will throw a false negative
                    if (savedTiles?.length === 0 && storedSequence === 0) {
                        checkWinCondition();
                    }
                }

                else {
                    setTimer(0);
                    setSavedGrid(baseGrid);
                    randomizeTiles();
                }

            }
            setReadyToRender(true)
        }
    },[currentPuzzlyNum, imgUrl])

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
        if (remainingTiles.length + sequencedTiles.length === 16){
            window.localStorage.setItem('remainingPuzzlyTiles',JSON.stringify(remainingTiles))
            window.localStorage.setItem('sequencedPuzzlyTiles',JSON.stringify(sequencedTiles))
            if (remainingTiles.length === 0 && sequencedTiles.length === 16) {
                checkWinCondition()
            }
        }
    }, [remainingTiles.length, sequencedTiles.length, sequencedTiles])

    const grabSavedTile = (grid, tileBank) => {
        if (tileBank.length) {
            return tileBank[0];
        }
        else {
            return grid.flat().map(tile => tile)[0]
        }
    }

    const checkSavedTilePuzzlyId = (tile) => {
        if (tile?.puzzlyId === currentPuzzlyNum) return true
        return false
    }

    const randomizeTiles = () => {
        let tileArr = [];
        for (let i=1; i<=16; i++) {
            tileArr.push({
                id: i,
                rowId: Math.floor((i-1) / 4),
                colId: (i-1) % 4,
                puzzlyId: currentPuzzlyNum
            })
        }
        // randomize loop
        for (let i=15; i>=0; i--) {
            let j = Math.floor(Math.random()*(i+1))
            let temp = tileArr[i];
            tileArr[i] = tileArr[j];
            tileArr[j] = temp;
        }
        window.localStorage.setItem('usedHint','false')
        setUsedHint(false)
        setRemainingTiles(tileArr);
    }

    const checkTilesSequenced = () => {
        const arr = (sequencedTiles.length === 16) ? sequencedTiles : savedGrid?.flat().filter(val => val);
        if (!arr || arr.length !== 16) {
            return false;
        }
        
        for (let i = 0; i < arr.length -1; i++) {
            if (arr[i] > arr[i+1]) {
                return false;
            }
        }
        return true;
    }

    const updateStats = () => {
        if (!puzzlyHistory.filter(puzzly => puzzly.puzzly === currentPuzzlyNum).length){
            // might only do this if no user logged in. If user, then invoke different method to create new table entry for UserTime table
            const historyLength = puzzlyHistory.length;
            const updatedPuzzlyHistory = [...puzzlyHistory, {puzzly: currentPuzzlyNum, time: timer}]
            setPuzzlyHistory(updatedPuzzlyHistory);
            window.localStorage.setItem('puzzlyHistory', JSON.stringify(updatedPuzzlyHistory));

            if (historyLength) {
                let newAverage = Math.floor(((averageTime * historyLength) + timer) / (historyLength + 1));
                window.localStorage.setItem('averagePuzzlyTime', newAverage);
                setAverageTime(newAverage);
            }
            else {
                window.localStorage.setItem('averagePuzzlyTime', timer)
                setAverageTime(timer)
            }

            if (puzzlyHistory.filter(puzzly => puzzly.puzzly === (currentPuzzlyNum-1)).length) {
                window.localStorage.setItem('puzzlyStreak', `${streak+1}`)
                setStreak(streak + 1);
            }
            else {
                setStreak(1);
                window.localStorage.setItem('puzzlyStreak','1');
            }
        }
        // also want a streak stat...
        // might be a little more complicated to calulate
        // can filter and check if puzzlyHistory contains previous puzzly number
        // - if yes, increment streak
        // - else, set streak to 1
    }

    const checkWinCondition = () => {
        if (checkTilesSequenced()) {
            setCompleted(true);
            // at later time, will look to update user's db
            // before that, can look to create some new stats as written out in a different component

            updateStats();

            window.localStorage.setItem('lastCompletedPuzzly',`${currentPuzzlyNum}`);
            window.localStorage.setItem('lastCompletedPuzzlyTime',`${timer}`)
            window.localStorage.setItem('currentPuzzlyTimer','0')
            window.localStorage.setItem('completedPuzzlyGrid',JSON.stringify(savedGrid))
            window.localStorage.setItem('savedPuzzlyGrid',JSON.stringify(baseGrid))
            window.localStorage.setItem('sequencedPuzzlyTiles',JSON.stringify([]));

            // - COULD CHECK TO SEE IF A USER EXISTS IN STATE FIRST

            openWinModal()
        } else {
            if (!errorPopup) {
                alert("Hmm... something is out of place. Keep trying!")
                // could make a modal or style the alert window further
                // or, could make an error toast popup; might be better option
                setErrorPopup(true)
            }
        }
    }
    const openWinModal = () => {
        setShowWinModal(true)
    }

    const openHintModal = () => {
        setShowHintModal(true);
        setUsedHint(true);
        window.localStorage.setItem('usedHint','true')
    }

    const bubbleUpGrid = (arr2d) => {
        // save grid to local storage here
        window.localStorage.setItem('savedPuzzlyGrid', JSON.stringify(arr2d))
        setSavedGrid(arr2d)
        const flattened = arr2d.flat()
        const arr = flattened.filter(val => val?.id).map(val => val.id)
        setSequencedTiles(arr);
    }

    const bubbleUpSelected = (tile) => {
        setSelectedTile(tile);
    }   

    const removeFromTileBank = (tileToRemove) => {
        const removed = remainingTiles.filter(tile => tile.id != tileToRemove.id)
        setRemainingTiles(removed)
    }

    // may need to modify if type changes at all
    const addToTileBank = (tileToAdd, selected) => {
        const added = [...remainingTiles, tileToAdd]
        const filtered = added.filter(tile => tile.id != selected?.div.dataset.tileId)
        setRemainingTiles(filtered)
    }

    const updateGridSquare = (value) => {
        setUpdateGridValue(value)
    }

    return(
        // - look into how can make sure grid/tilebank also ready to render at same time?
        readyToRender ?
             <div id="playPage">
                {showWinModal ? <WinModal setShowWinModal={setShowWinModal} imgUrl={imgUrl} time={timer} puzzlyNumber={currentPuzzlyNum} usedHint={usedHint} completedPuzzlys={puzzlyHistory.length} averageTime={averageTime} streak={streak}/> : null}
                <div id="titleHintContainer">
                    <h2>Puzzly #{currentPuzzlyNum}</h2>
                    {!completed ? <p id="hint" onClick={openHintModal}>Hint?</p> : null}
                    {showHintModal ? <HintModal setShowHintModal={setShowHintModal} imgUrl={imgUrl}/> : null}
                </div>
                <h4 id="timer">Timer: {timer}s</h4>
                <SolveGrid selectedTile={selectedTile} bubbleUpSelected={bubbleUpSelected} removeFromTileBank={removeFromTileBank} addToTileBank={addToTileBank} updateGridValue={updateGridValue} bubbleUpGrid={bubbleUpGrid} savedGrid={savedGrid} completed={completed} imgUrl={imgUrl}/>
                <br/>
                <TileBank tiles={remainingTiles} selectedTile={selectedTile} bubbleUpSelected={bubbleUpSelected} addToTileBank={addToTileBank} updateGridSquare={updateGridSquare} imgUrl={imgUrl}/>
            </div>
            :
            <></>
    )
}

export default Play;
