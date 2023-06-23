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
        streak,
        darkMode}) => {
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
        navigator.clipboard.writeText(`Completed Puzzly ${puzzlyNumber} in ${convertSecsToMins(time)}${usedHint ? '*' : ''}!\nFollow link to play: puzzly.us 🧩 `);
        Toastify({text: "Copied to clipboard!", duration:1000 ,gravity: "bottom", position: "right", backgroundColor: "dodgerBlue"}).showToast();
    }

    return ReactDom.createPortal(
        <div className="winModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="winModal"  className={darkMode ? "darkMode" : ""}>
                <button className="closeModal" onClick={() => setShowWinModal(false)}>X</button>
                <h2 id="winCongrats">Congratulations!</h2>
                <div id="winMessage">
                    You completed Puzzly {puzzlyNumber} in {convertSecsToMins(time)}{usedHint ? '*' : ''}!
                </div>
                <table id="winStatisticsTable">
                    <tbody>
                        <tr id="statsValues">
                            <td>{completedPuzzlys ? completedPuzzlys : 1}</td>
                            <td>{streak ? streak : 1}</td>
                            <td>{convertSecsToMins(averageTime)}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr id="statsHeader">
                            <th>Total Completed</th>
                            <th>Current Streak</th>
                            <th>Average Time</th>
                        </tr>
                    </tfoot>
                    {/* if save log of all times, could show a barchart as well later */}
                </table>
                <img id="winModalImg" src={imgUrl}/>
                {usedHint ? <div id="hintUsedMessage">* denotes hint was used. Try solving future Puzzlys without a hint for a bigger challenge!</div> : <br/>}
                <button className="shareButton" onClick={shareButtonClickHandler}>Share Time</button>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default WinModal