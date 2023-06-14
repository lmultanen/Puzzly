import React, { useState , useEffect } from "react";

const SolveGrid = ({
        selectedTile,
        bubbleUpSelected, 
        removeFromTileBank, 
        addToTileBank, 
        updateGridValue,
        bubbleUpGrid,
        savedGrid,
        completed}) => {

    // const baseGrid = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];

    const [grid,setGrid] = useState(null);
    const [selected, setSelected] = useState(null);
    const [swapCoords, setSwapCoords] = useState(null);

    useEffect(() => {
        // will first want to check if anything in local storage

        setGrid(savedGrid);
        // maybe on page exit, save grid to local storage
        // on page open, check if local storage grid exists. if so, parse, otherwise use baseGrid
    },[savedGrid])

    useEffect(() => {
        setSelected(selectedTile);
        if ((selectedTile === null) && (swapCoords !== null)) {
            setSwapCoords(null);
        }

    },[selectedTile])

    useEffect(() => {
        if (updateGridValue && swapCoords) {
            grid[swapCoords.row][swapCoords.col] = updateGridValue;
            // bubble up grid here
            bubbleUpGrid(grid)
            setGrid(grid)
            setSelected(null)
            bubbleUpSelected(null)
        }
    },[updateGridValue])

    useEffect(() => {
        // just want to make sure grid not clickable when puzzly completed
    },[completed])

    const onClickHandler = (rowId,colId) => (e) => {
        if (!completed){
            if (selected) {
                if (e.target.textContent) {
                    if (swapCoords) {
                        // will need to improve this later

                        // NEED TO SWAP ACTUAL TILES HERE
                        // currently just overwriting values in array; need to reset actual object
                        grid[swapCoords.row][swapCoords.col] = grid[rowId][colId];
                    }
                    else {
                        // need to get the actual tile here
                        addToTileBank(grid[rowId][colId], selected)
                    }
                    // e.target.textContent = selected.div.textContent;
                    grid[rowId][colId] = selected.tile;
                }
                else {
                    // e.target.textContent = selected.tile;
                    // need to figure out how to actually use the row/col
                    grid[rowId][colId] = selected.tile;
                    if (swapCoords) {
                        grid[swapCoords.row][swapCoords.col] = null;
                    }
                    else {
                        removeFromTileBank(selected.tile)
                    }
                }
                selected.div.className = selected.div.className.replace('selected','');
                bubbleUpSelected(null)
                grid[rowId][colId] = selected.tile;
                bubbleUpGrid(grid)
                setGrid(grid)
                setSwapCoords(null);
            } else {
                if(e.target.textContent) {
                    console.log(e.target)
                    console.log(grid[rowId][colId])
                    setSelected({div: e.target, tile: grid[rowId][colId]});
                    bubbleUpSelected({div: e.target, tile: grid[rowId][colId]});
                    setSwapCoords({row: rowId, col: colId});
                }
            }
        }
    } 

    return(
        <div id="solveGrid">
            {grid?.length ? grid.map((row,rowId) => (
                <div className="solveGridRow" key={rowId}>
                    {row.map((col,colId) => (
                        // may ultimately move this div into separate componenet
                        <div className={`${selected ? "solveGridSquare wiggle" : "solveGridSquare"} ${(col && !completed) ? "clickable" : ""} ${((Number(selected?.tile.id) === col?.id))? "selected" : ''}`} key={colId}  onClick={onClickHandler(rowId,colId)}>
                            {col?.id ? col.id : col}
                        </div>
                    ))}
                </div>
            )) : <div>Loading...</div>}
        </div>
    )
}

export default SolveGrid;

// later add-on: could customize grid size somewhat; add in 5x5 or 6x6 setting

// need to refactor storing numbers to tiles...
// bugs to fix: clicking from grid to tile bank doesn't work