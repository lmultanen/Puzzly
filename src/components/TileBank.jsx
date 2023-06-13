import React, { useState, useEffect } from "react";

const TileBank = ({tiles, selectedTile, bubbleUpSelected, addToTileBank, updateGridSquare}) => {

    const [selected, setSelected] = useState(null)
    // may ultimately want to move this to a redux store; would be easier than passing around stuff

    useEffect(() => {
        setSelected(selectedTile)
    },[selectedTile])

    const onClickHandler = (e) => {
        if (!selected) {
            e.target.className += " selected";
            // will later likely change this somehow
            setSelected(e.target)
            bubbleUpSelected(e.target)
        }
        else {
            selected.className = selected.className.replace('selected','');
            
            // will need to modify this later with Tile constructs
            // basically, doesn't make sense to swap tiles inside tile bank; should just select new one
            if (!tiles.includes(Number(selected.textContent))) {
                addToTileBank(selected.textContent, e.target)
                // will need to change later
                updateGridSquare(Number(e.target.textContent));
                setSelected(null);
            }
            else if (tiles.includes(Number(selected.textContent)) 
                && selected.textContent !== e.target.textContent) {
                e.target.className += " selected";
                setSelected(e.target);
                bubbleUpSelected(e.target)
            }
            else {
                setSelected(null);
                bubbleUpSelected(null);
            }
        }
    }

    return(
        <div id="tileBankContainer">
            <p>Tile Bank:</p>
            <div id="tileBank">
                {tiles.length ? tiles.map((tile,idx) => (
                    <div className="tileBankTile" key={idx} onClick={onClickHandler}>
                        {tile}
                    </div>
                )) : <div>No Tiles Remaining</div>}
            </div>
        </div>
    )
}

export default TileBank;

// TODO: 
// - after that, can start hooking up some logic to check if player has won
// --- for this dummy case, will just check that numbers are in order
// --- for actual game, may rely on checking that the object ids are in order or something
// - add some additional styling
// - when game completed, reset local storage timer to zero
// - work on other persistance/saving tile positioning in local storage
// - could maybe just save both the solve grid and remainingTiles and load those directly
// --- json parse/stringify would be my friend

// - add a button to remove all tiles from solve grid and add to bank; basically a reset button
// - add ability for player to move tile from grid directly to bank rather than swapping?

// add some other local storage stats to start working on the 'share' page

// once this basic dummy fiunctionatliy in place, then start hooking up a backend and figuring out how to convert pictures to tiles
// once that is in place, will need to seed images
// - also will want a way to figure out how to add more images at a later date; goal should be enough for a year to start

// add spinning wheel or something when loading the play page instead of seeing flash of empty boxes/text




// for way later:
// - could add some fun css animations for when all tiles are placed in solvegrid
// - for instance, have the margins disappear: if correct, then tiles could spin in place and outline becomes green
// - if incorrect, have the tiles shake and outline in red briefly before moving back apart