import React, { useState , useEffect } from "react";

const SolveGrid = ({
        selectedTile,
        bubbleUpSelected, 
        removeFromTileBank, 
        addToTileBank, 
        updateGridValue,
        bubbleUpGrid,
        savedGrid,
        completed,
        imgUrl}) => {

    const [grid,setGrid] = useState(null);
    const [selected, setSelected] = useState(null);
    const [swapCoords, setSwapCoords] = useState(null);
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        setGrid(savedGrid);
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
            bubbleUpGrid(grid)
            setGrid(grid)
            setSelected(null)
            bubbleUpSelected(null)
        }
    },[updateGridValue])

    useEffect(() => {
    },[completed])

    useEffect(() => {
        if (window.localStorage.getItem('puzzlyDarkMode') === 'true') {
            setDarkMode(true)
        }
    },[])

    const onClickHandler = (rowId,colId) => (e) => {
        if (!completed){
            if (selected) {
                if (e.target.dataset.tileId != 0) {
                    if (swapCoords) {
                        grid[swapCoords.row][swapCoords.col] = grid[rowId][colId];
                    }
                    else {
                        addToTileBank(grid[rowId][colId], selected)
                    }
                    grid[rowId][colId] = selected.tile;
                }
                else {
                    grid[rowId][colId] = selected.tile;
                    if (swapCoords) {
                        grid[swapCoords.row][swapCoords.col] = null;
                    }
                    else {
                        removeFromTileBank(selected.tile)
                    }
                }
                selected.div.parentElement.className = selected.div.parentElement.className.replace('selected','');
                bubbleUpSelected(null)
                grid[rowId][colId] = selected.tile;
                bubbleUpGrid(grid)
                setGrid(grid)
                setSwapCoords(null);
            } else {
                if(e.target.dataset.tileId != 0) {
                    setSelected({div: e.target, tile: grid[rowId][colId]});
                    bubbleUpSelected({div: e.target, tile: grid[rowId][colId]});
                    setSwapCoords({row: rowId, col: colId});
                }
            }
        }
    } 

    return(imgUrl ?
        <div id="solveGrid">
            {grid?.length ? grid.map((row,rowId) => (
                <div className="solveGridRow" key={rowId}>
                    {row.map((col,colId) => (
                        <div className={`${selected ? "solveGridSquare wiggle" : "solveGridSquare"} ${(col && !completed) ? "clickable" : ""} ${((Number(selected?.tile.id) === col?.id))? "selected" : ''} ${darkMode ? "darkMode" : ""}`} key={colId} data-tile-id={col?.id ? col.id : 0} onClick={onClickHandler(rowId,colId)}>
                            {col?.id ? 
                                <img style= {{scale: "4",position: "relative", left: `${150 - col.colId*100}%`, top: `${150 - col.rowId*100}%`}} src={imgUrl} data-tile-id={col?.id ? col.id : 0}/> 
                                : ''
                            }
                        </div>
                    ))}
                </div>
            )) : <div>Loading...</div>}
        </div>
        : <></>
    )
}

export default SolveGrid;