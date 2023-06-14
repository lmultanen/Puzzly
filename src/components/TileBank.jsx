import React, { useState, useEffect } from "react";

const TileBank = ({tiles, selectedTile, bubbleUpSelected, addToTileBank, updateGridSquare}) => {

    const [selected, setSelected] = useState(null)
    // may ultimately want to move this to a redux store; would be easier than passing around stuff

    useEffect(() => {
        setSelected(selectedTile)
    },[selectedTile])

    const onClickHandler = (e) => {
        console.log(e.target)
        const selectedTile = tiles.filter(tile => tile.id === (Number(e.target.textContent)))[0]
        if (!selected) {
            e.target.className += " selected";
            // will later likely change this somehow
            // const selectedTile = tiles.filter(tile => tile.id === (Number(e.target.textContent)))[0]
            console.log(tiles)
            console.log(selectedTile)
            // refactoring to pass in current div in object, then will add tile once functionality working
            setSelected({div: e.target, tile: selectedTile})
            bubbleUpSelected({div: e.target, tile: selectedTile})
        }
        else {
            selected.div.className = selected.div.className.replace('selected','');
            
            // will need to modify this later with Tile constructs
            // basically, doesn't make sense to swap tiles inside tile bank; should just select new one

            const tileIds = tiles.map(tile => tile.id)
            console.log(tileIds)
            console.log

            if (!tileIds.includes(Number(selected.div.textContent))) {
                // pass tile object instead of number here
                // necessary with how I had to refactor this method
                addToTileBank(selected.tile, {div: e.target})
                // will need to change later

                // PASS IN TILE CONSTRUCT HERE
                

                updateGridSquare(selectedTile);
                setSelected(null);
            }
            else if (tileIds.includes(Number(selected.div.textContent)) 
                && selected.textContent !== e.target.textContent) {
                e.target.className += " selected";

                // PASS IN TILE CONSTRUCT HERE
                setSelected({div: e.target, tile: selectedTile});
                bubbleUpSelected({div: e.target, tile: selectedTile})
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
                        {tile.id}
                    </div>
                )) : <div>No Tiles Remaining</div>}
            </div>
        </div>
    )
}

export default TileBank;

// TODO: 
// - after that, can start hooking up some logic to check if player has won
// --- for actual game, may rely on checking that the object ids are in order or something
// --- something worth looking into: instead of storing tiles on back end, can i generate them in the Play component?
// --- for instance, figure out a way to take in the img from backend, then cut it up in the component itself and randomize the tile order?
// --- might be easier than having to continually store/delete from a dedicated table on backend
// - add some additional styling
// - add some additional local storage stats
// - develop win page modal pop up; can display historical statistics and allow user to share current day's time

// - add a button to remove all tiles from solve grid and add to bank; basically a reset button
// - add ability for player to move tile from grid directly to bank rather than swapping?

// once this basic dummy fiunctionatliy in place, then start hooking up a backend and figuring out how to convert pictures to tiles
// once that is in place, will need to seed images
// - also will want a way to figure out how to add more images at a later date; goal should be enough for a year to start

// add spinning wheel or something when loading the play page instead of seeing flash of empty boxes/text


// for way later:
// - could add some fun css animations for when all tiles are placed in solvegrid
// - for instance, have the margins disappear: if correct, then tiles could spin in place and outline becomes green
// - if incorrect, have the tiles shake and outline in red briefly before moving back apart