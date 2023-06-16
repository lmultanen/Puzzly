import React, { useState, useEffect } from "react";

const TileBank = ({
        tiles, 
        selectedTile, 
        bubbleUpSelected, 
        addToTileBank, 
        updateGridSquare, 
        imgUrl}) => {

    const [selected, setSelected] = useState(null)
    // may ultimately want to move this to a redux store; would be easier than passing around stuff

    useEffect(() => {
        setSelected(selectedTile)
    },[selectedTile])

    const onClickHandler = (e) => {
        const selectedTile = tiles.filter(tile => tile.id === (Number(e.target.dataset.tileId)))[0]
        if (!selected) {
            e.target.parentElement.className += " selected";
            setSelected({div: e.target, tile: selectedTile})
            bubbleUpSelected({div: e.target, tile: selectedTile})
        }
        else {
            selected.div.parentElement.className = selected.div.parentElement.className.replace('selected','');
            const tileIds = tiles.map(tile => tile.id)

            if (!tileIds.includes(selected.tile.id)) {
                // necessary with how I had to refactor this method
                addToTileBank(selected.tile, {div: e.target})
                updateGridSquare(selectedTile);
                setSelected(null);
            }
            else if (tileIds.includes(selected.tile.id) 
                && selected.tile.id !== Number(e.target.dataset.tileId)) {
                e.target.parentElement.className += " selected";

                setSelected({div: e.target, tile: selectedTile});
                bubbleUpSelected({div: e.target, tile: selectedTile})
            }
            else {
                setSelected(null);
                bubbleUpSelected(null);
            }
        }
    }

    return(imgUrl ?
            <div id="tileBankContainer">
                <p>Tile Bank:</p>
                <div id="tileBank">
                    {tiles.length ? tiles.map((tile,idx) => (
                        <div  className="tileBankTile" key={idx} data-tile-id={tile.id}>
                            <img style= {{scale: "4",position: "relative", left: `${150 - tile.colId*100}%`, top: `${150 - tile.rowId*100}%`}} data-tile-id={tile.id} onClick={onClickHandler} src={imgUrl}/>
                        </div>
                    )) : <div>No Tiles Remaining</div>}
                </div>
            </div>
            : <></>
    )
}

export default TileBank;

// TODO: 
// FIRST PRIORITY:
// - modal pop-up for when user has completed that day's puzzly; can include option to share their time
// --- after more stats have been added/stored, can display those as well
// - add a hint button
// --- will allow users to see the full picture in a pop-up modal
// --- if user's use the hint, then should track that in a state and note it when they share their score

// could add some settings in a tab
// - disable wiggle
// - dark mode
// - hard mode (hint disabled)

// - after that, can start hooking up some logic to check if player has won
// --- flesh out user stats more?
// - add some additional styling; consider making background color slightly less harsh
// - add some additional local storage stats (streak, total puzzly's completed, avg time, etc)
// --- will need to add some additional logic to the local storage stat keeping
// --- might be able to get away with having a null User model in redux store
// --- basically, if null User, then update stats in local storage; else, would save to user's model at later date
// - develop win page modal pop up; can display historical statistics and allow user to share current day's time

// - add a button to remove all tiles from solve grid and add to bank; basically a reset button
// - add ability for player to move tile from grid directly to bank rather than swapping?

// - seed a couple hundred images; try to find good quality ones
// - also will want a way to figure out how to add more images at a later date; goal should be enough for a year to start

// add a 'hint' button that shows the full image in a pop up
// - ideally, keep track if user used a hint. if they did, then put an asterisk next to their time when they share/in leaderboard

// add spinning wheel or something when loading the play page instead of seeing flash of empty boxes/text


// for way later:
// - could add some fun css animations for when all tiles are placed in solvegrid
// - for instance, have the margins disappear: if correct, then tiles could spin in place and outline becomes green
// - if incorrect, have the tiles shake and outline in red briefly before moving back apart