import React, { useState , useEffect } from "react";

const SolveGrid = ({selectedTile, bubbleUpSelected, removeFromTileBank, addToTileBank, updateGridValue}) => {

    // make a 4x4 array? may need to be a useState type thing
    // it's possible that the useState will be done in a subcomponent? each grid square could keep track of it's state, whether for a picture or empty
    // const grid = [[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]];
    // const grid = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
    const baseGrid = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];

    const [grid,setGrid] = useState(null);
    const [selected, setSelected] = useState(null);
    const [swapCoords, setSwapCoords] = useState(null);

    useEffect(() => {
        // will first want to check if anything in local storage
        setGrid(baseGrid);
        // maybe on page exit, save grid to local storage
        // on page open, check if local storage grid exists. if so, parse, otherwise use baseGrid
    },[])

    useEffect(() => {
        setSelected(selectedTile);
        console.log(swapCoords)
        if ((selectedTile === null) && (swapCoords !== null)) {
            setSwapCoords(null);
        }

    },[selectedTile])

    useEffect(() => {
        if (updateGridValue) {
            console.log(swapCoords)
            console.log(updateGridValue)
            grid[swapCoords.row][swapCoords.col] = updateGridValue;
            setGrid(grid)
            setSelected(null)
            bubbleUpSelected(null)
        }
    },[updateGridValue])

    const onClickHandler = (rowId,colId) => (e) => {
        console.log(grid)
        if (selected) {
            if (e.target.textContent) {
                if (swapCoords) {
                    // will need to improve this later
                    grid[swapCoords.row][swapCoords.col] = Number(e.target.textContent);
                }
                else {
                    addToTileBank(e.target.textContent, selected)
                }
                e.target.textContent = selected.textContent;
            }
            else {
                e.target.textContent = selected.textContent;
                if (swapCoords) {
                    grid[swapCoords.row][swapCoords.col] = null;
                }
                else {
                    removeFromTileBank(selected)
                }
            }
            selected.className = selected.className.replace('selected','');
            bubbleUpSelected(null)
            grid[rowId][colId] = Number(e.target.textContent);
            setGrid(grid)
            setSwapCoords(null);
            console.log(grid)
        } else {
            // handle clicking on gridSquare first
            if(e.target.textContent) {
                setSelected(e.target);
                bubbleUpSelected(e.target);
                setSwapCoords({row: rowId, col: colId});
            }
        }
    } 

    return(
        <div id="solveGrid">
            {/* Should make a test 4x4 grid and then get some basic styling. Then work on more functionality. */}
            {grid?.length ? grid.map((row,rowId) => (
                <div className="solveGridRow" key={rowId}>
                    {row.map((col,colId) => (
                        // may ultimately move this div into separate componenet
                        <div className={`${selected ? "solveGridSquare wiggle" : "solveGridSquare"} ${col ? "clickable" : ""} ${((Number(selected?.textContent) === col) && col)? "selected" : ''}`} key={colId}  onClick={onClickHandler(rowId,colId)}>
                            {col ? col : ''}
                        </div>
                    ))}
                </div>
            )) : <div>Loading...</div>}
        </div>
    )
}

export default SolveGrid;

// weird bug where have to triple click on a swapped solve grid square with tile bank
// something to do with swap coords