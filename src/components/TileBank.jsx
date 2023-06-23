import React, { useState, useEffect } from "react";

const TileBank = ({
        tiles, 
        selectedTile, 
        bubbleUpSelected, 
        addToTileBank, 
        updateGridSquare, 
        imgUrl}) => {

    const [selected, setSelected] = useState(null)
    
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        setSelected(selectedTile)
    },[selectedTile])

    useEffect(() => {
        if (window.localStorage.getItem('puzzlyDarkMode') === 'true') {
            setDarkMode(true)
        }
    },[])

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
                <div id="tileBank" className={darkMode ? "darkMode" : ""}>
                    {tiles.length ? tiles.map((tile,idx) => (
                        <div  className="tileBankTile" key={idx} data-tile-id={tile.id}>
                            <img style= {{scale: "4",position: "relative", left: `${150 - tile.colId*100}%`, top: `${150 - tile.rowId*100}%`}} data-tile-id={tile.id} onClick={onClickHandler} src={imgUrl}/>
                        </div>
                    )) : <div id='noTilesMsg' className={darkMode ? "darkMode" : ""}>No Tiles Remaining</div>}
                </div>
            </div>
            : <></>
    )
}

export default TileBank;

// TODO: 

// - add a button to remove all tiles from solve grid and add to bank; basically a reset button
// - add ability for player to move tile from grid directly to bank rather than swapping?

// - seed a couple hundred images; try to find good quality ones
// - also will want a way to figure out how to add more images at a later date; goal should be enough for a year to start


// add spinning wheel or something when loading the play page instead of seeing flash of empty boxes/text


// for way later:
// - could add some fun css animations for when all tiles are placed in solvegrid
// - for instance, have the margins disappear: if correct, then tiles could spin in place and outline becomes green
// - if incorrect, have the tiles shake and outline in red briefly before moving back apart