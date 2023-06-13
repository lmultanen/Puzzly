import React, { useState , useEffect } from "react";

const SolveGrid = ({selected, bubbleUpSelected, removeFromTileBank, addToTileBank}) => {

    // make a 4x4 array? may need to be a useState type thing
    // it's possible that the useState will be done in a subcomponent? each grid square could keep track of it's state, whether for a picture or empty
    // const grid = [[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]];
    // const grid = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
    const grid = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];

    const onClickHandler = (e) => {
        if (selected) {
            // do this if e.target.textContent is null
            // let temp = null;
            if (e.target.textContent) {
                addToTileBank(e.target.textContent, selected)
                e.target.textContent = selected.textContent;
                selected.className = "tileBankTile"
                // temp = Number(e.target.textContent);
            }
            // if (!e.target.textContent) {
            //     e.target.textContent = selected.textContent;
            //     selected.className = "tileBankTile"
            // }
            // e.target.textContent = selected.textContent;
            // selected.className = "tileBankTile"
            else {
                e.target.textContent = selected.textContent;
                selected.className = "tileBankTile"
                removeFromTileBank(selected)
            }
            bubbleUpSelected(null)
        }
    }

    // should be able to click on squares that are already filled

    return(
        <div id="solveGrid">
            {/* Should make a test 4x4 grid and then get some basic styling. Then work on more functionality. */}
            {grid.length ? grid.map((row,idx) => (
                <div className="solveGridRow" key={idx}>
                    {row.map((col,idx) => (
                        // may ultimately move this div into separate componenet
                        // add click handler
                        <div className={selected ? "solveGridSquare wiggle" : "solveGridSquare"} key={idx}  onClick={onClickHandler}>
                            {/* {col} */}
                            {col ? col : ''}
                        </div>
                    ))}
                </div>
            )) : <div>Loading...</div>}
        </div>
    )
}

export default SolveGrid;