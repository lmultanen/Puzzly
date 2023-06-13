import React, { useState , useEffect } from "react";

const SolveGrid = ({
        selectedTile,
        bubbleUpSelected, 
        removeFromTileBank, 
        addToTileBank, 
        updateGridValue,
        bubbleUpGrid}) => {

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
        if ((selectedTile === null) && (swapCoords !== null)) {
            setSwapCoords(null);
        }

    },[selectedTile])

    useEffect(() => {
        if (updateGridValue) {
            grid[swapCoords.row][swapCoords.col] = updateGridValue;
            // bubble up grid here
            bubbleUpGrid(grid)
            setGrid(grid)
            setSelected(null)
            bubbleUpSelected(null)
        }
    },[updateGridValue])

    const onClickHandler = (rowId,colId) => (e) => {
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
            // bubbleUpGrid here
            bubbleUpGrid(grid)
            setGrid(grid)
            setSwapCoords(null);
        } else {
            if(e.target.textContent) {
                setSelected(e.target);
                bubbleUpSelected(e.target);
                setSwapCoords({row: rowId, col: colId});
            }
        }
    } 

    return(
        <div id="solveGrid">
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
