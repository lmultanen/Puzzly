import React from "react";

const Play = () => {
    return(
        <div>
            <h2>Placeholder for the Play page</h2>
            <p>This page will consist of two main sections: the Solve Grid and the Tile Bank, which will be stacked on top of each other.</p>
            <p>The Solve Grid will be a (likely) 4x4 grid with a slight margin between each slot and a faint outline for each slot.</p>
            <p>The Tile Bank will display the unplaced tiles. Users will be able to select a tile by tapping it and then placing it by tapping a square in the Solve Grid.</p>
            <p>Once the player has placed all tiles in the Solve Grid, if the order is correct, they will have completed that day's Puzzly.</p>
            <p>If the order is incorrect, have some text appear below the Solve Grid explaining "hmm... some tiles seem to be out of order" and outline the Solve Grid in red.</p>
            <p>There should be a timer counting up from 0 seconds (and into minutes) at the top of the screen. Completed the Puzzly will cause the timer to stop and a pop up modal should congratulate the player and allow them to share their result by clicking a share button.</p>
            <p>Clicking said 'share' button should copy to the player's clipboard a message like "I solved Puzzly #3 in 43 seconds" and then maybe include a link to the puzzly site as well at the end.</p>
        </div>
    )
}

export default Play;