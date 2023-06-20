import React, { useRef } from "react";
import ReactDom from "react-dom";

// could also just pass in an object with user stats/time/hintUsed
const WinModal = ({
        setShowWinModal, 
        imgUrl, 
        time, 
        puzzlyNumber, 
        usedHint,
        completedPuzzlys,
        averageTime,
        streak}) => {
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
        const seconds = Math.floor(timeInSeconds - (60 * mins));
        const minsAndSecs = str_pad_left(mins,'0',2) + ':' + str_pad_left(seconds,'0',2);
        if (hours) {
            return str_pad_left(hours,'0',2) + ':' + minsAndSecs;
        }
        else {
            return minsAndSecs;
        }
    }

    const shareButtonClickHandler = () => {
        navigator.clipboard.writeText(`Completed${usedHint ? '*' : ''} Puzzly ${puzzlyNumber} in ${convertSecsToMins(time)}!\n(add emoji or something)\nFollow link to try: puzzly.us`);
        // alert("Copied to clipboard")
        // could have a toast popup instead?
    }

    return ReactDom.createPortal(
        <div className="winModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="winModal">
                <button className="closeModal winButton" onClick={() => setShowWinModal(false)}>X</button>
                <h2 id="winCongrats">Congratulations!</h2>
                <div id="winMessage">
                    {/* could write a conversion method to convert time to minute format */}
                    {/* You completed Puzzly {puzzlyNumber} in {time}{usedHint ? '*' : ''} seconds! */}
                    You completed{usedHint ? '*' : ''} Puzzly {puzzlyNumber} in {convertSecsToMins(time)}!
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
                            <td>{completedPuzzlys}</td>
                            <td>{streak ? streak : 1}</td>
                            <td>{convertSecsToMins(averageTime)}</td>
                        </tr>
                    </tbody>
                    {/* if save log of all times, could show a barchart as well later */}
                </table>
                <img id="winModalImg" src={imgUrl}/>
                {usedHint ? <div id="hintUsedMessage">* denotes hint was used. Try solving future Puzzlys without a hint for a bigger challenge!</div> : <br/>}
                {/* add in copy functionality here later */}
                <button className="shareButton" onClick={shareButtonClickHandler}>Share Time</button>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default WinModal

// next step: add in further stat collection to local storage
// - create an array of objects that keeps track of {puzzly: num, time: seconds}
// --- can calculate total completed from length of this array
// - keep track of current streak
// - keep track of avg time in seconds

// then, can pass in stats object to this winModal as well
// - once stats completed, then can work on setting up User model in backend
// - will want an instance method that allows for a new User to load local storage stats to db
// - the object array above will need to create user -> image association that keeps track of puzzlyNum, timeInSeconds
// --- or, create new table model that just is associated to User containing the above info; doesn't necessarily need to be associated to the image