import React, { useRef } from "react";
import ReactDom from "react-dom";

// could also just pass in an object with user stats/time/hintUsed
const WinModal = ({setShowWinModal, imgUrl, time, puzzlyNumber, usedHint}) => {
    const modalRef = useRef();
    const closeModal = (e) => {
        if (e.target === modalRef.current) {
            setShowWinModal(false)
        }
    }

    function str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
      }

    const convertSecsToMins = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        timeInSeconds = timeInSeconds - (3600 * hours);
        const mins = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds - (60 * mins);
        const minsAndSecs = str_pad_left(mins,'0',2) + ':' + str_pad_left(seconds,'0',2);
        if (hours) {
            return str_pad_left(hours,'0',2) + ':' + minsAndSecs;
        }
        else {
            return minsAndSecs;
        }
    }

    return ReactDom.createPortal(
        <div className="winModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="winModal">
                <button className="closeModal winButton" onClick={() => setShowWinModal(false)}>X</button>
                <h2 id="winCongrats">Congratulations!</h2>
                <div id="winMessage">
                    {/* could write a conversion method to convert time to minute format */}
                    {/* You completed Puzzly {puzzlyNumber} in {time}{usedHint ? '*' : ''} seconds! */}
                    You completed Puzzly {puzzlyNumber} in {convertSecsToMins(time)}{usedHint ? '*' : ''}!
                </div>
                {/* UPDATE WITH REAL STATS */}
                <table id="winStatisticsTable">
                    <thead>
                        <tr id="statsHeader">
                            <th>Total Completed</th>
                            <th>Current Streak</th>
                            <th>Average Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="statsValues">
                            <td>3</td>
                            <td>1</td>
                            <td>01:29</td>
                        </tr>
                    </tbody>
                    {/* if save log of all times, could show a barchart as well later */}
                </table>
                <img id="winModalImg" src={imgUrl}/>
                {usedHint ? <div id="hintUsedMessage">* denotes hint was used. Try solving future Puzzlys without a hint for a bigger challenge!</div> : <br/>}
                {/* add in copy functionality here later */}
                <button className="shareButton" onClick={()=> {}}>Share Time</button>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default WinModal