import React from "react";

const Rules = () => {
    return(
        <div id="rulesContainer">
            <h1>
                How to Play:
            </h1>

            <div className="ruleBlock">
                <h4>
                    Overview:
                </h4>
                <p>- Puzzly is a daily puzzle game, where players should aim to piece together the day's picture.</p>
                <p>- Each Puzzly consists of a square image broken up into 16 tiles, which are initially placed into the player's Tile Bank.</p>
                <p>- The goal is move and place all the tiles from the Tile Bank into the 4x4 Solve Grid to complete the picture while racing against the clock.</p>
            </div>
            
            <div className="ruleBlock">
                <h4>
                    Tile Movement:
                </h4>
                <p>- Players can click/tap on tiles to select them. Once a tile is selected, players can click on any square in the Solve Grid to move the tile to that location.</p>
                <p>- If a tile is already placed in the spot the Solve Grid, then those two tiles will swap places.</p>
                <p>- If a player clicks on the currently selected tile, the tile becomes unselected.</p>
                <p>- Once a tile is moved from the Tile Bank to the Solve Grid, it cannot move back unless it is swapped with a different tile in the Tile Bank.</p>
                <p>- When there are no more tiles remaining in the Tile Bank, players will not be able to move tiles back to the bank, and they will have to swap tiles in the Solve Grid until all pieces are in the correct position.</p>
                <p>- If a player gets stuck, they can click on the 'Hint' button in the top right corner to view the image in full. However, their time on the Leaderboard will show an asterisk next to it, letting their friends know they used a hint that day!</p>
            </div>

            <div className="ruleBlock">
                <h4>
                    The Leaderboard:
                </h4>
                <p>- Players can create an account on the Leaderboard page and add their friends by username by clicking on the "Friends List" button. Players can then see all of their friends' times as each person completes the Puzzly for that day.</p>
                <p>- The leaderboard is entirely optional, but for those of you with a competitive streak, share Puzzly with your friends to see who gets daily bragging rights!</p>
            </div>

            <h2 id="haveFunMsg">
                Have fun playing Puzzly!
            </h2>
        </div>
    )
}
export default Rules;