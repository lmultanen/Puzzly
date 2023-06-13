import React, { useState, useEffect } from "react";

const TileBank = ({tiles, selectedTile, bubbleUpSelected}) => {

    // may need to input tiles as a prop
    // which would mean need an individual Tile component
    // that could make sense: in the Play page, can grab the Tiles from backend
    // can then keep track of an Array of Tiles that gets passed into the TileBank
    // - pass individual tiles into individual SolveGridSquare components as well

    // inside Tile component, will want to assign all tiles an onClick handler
    // - handler will select tile when no other tiles are selected
    // - may also bubble up a bool or fire a handler to let the Play component/SolveGrid component know when tile is selected
    // - 

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
            // console.log(selected)
            selected.className = "tileBankTile";
            
            // will need to modify this later with Tile constructs
            // basically, doesn't make sense to swap tiles inside tile bank; should just select new one
            if (tiles.includes(Number(selected.textContent)) 
                && selected.textContent !== e.target.textContent) {
                e.target.className += " selected";
                setSelected(e.target);
                bubbleUpSelected(e.target)
            }
            else {
                setSelected(null);
                bubbleUpSelected(null);
            }
            // this may work for now in dummy case, but will likely want to flesh out further when adding in real tiles
            // will also need to build out functionality to swap two tiles/place tile
            // - currently, just unselecting the first tile no matter what

        }
    }

    return(
        <div id="tileBankContainer">
            <p>Tile Bank:</p>
            <div id="tileBank">
                {/* Make a tile bank here without any tiles in them. Focus on shape/basic orientation for now. */}
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
// - solve bug where when clicking same tile spot in bank after already moving it up to solve grid, need to click twice to select
// - add ability to click on tiles in solve grid and move around/even swap
// --- will require using a different method than the addToBank; may need to make more robust or a general 'swap' method
// --- could make a swap method that takes in the 'selected' and target and just change their values
// - after that, can start hooking up some logic to check if player has won
// --- for this dummy case, will just check that numbers are in order
// --- for actual game, may rely on checking that the object ids are in order or something
// - add some additional styling
// - when game completed, reset local storage timer to zero
// - work on other persistance/saving tile positioning in local storage
// - could maybe just save both the solve grid and remainingTiles and load those directly
// --- json parse/stringify would be my friend

// - add a button to remove all tiles from solve grid and add to bank; basically a reset button

// add some other local storage stats to start working on the 'share' page

// once this basic dummy fiunctionatliy in place, then start hooking up a backend and figuring out how to convert pictures to tiles
// once that is in place, will need to seed images
// - also will want a way to figure out how to add more images at a later date; goal should be enough for a year to start




// for way later:
// - could add some fun css animations for when all tiles are placed in solvegrid
// - for instance, have the margins disappear: if correct, then tiles could spin in place and outline becomes green
// - if incorrect, have the tiles shake and outline in red briefly before moving back apart