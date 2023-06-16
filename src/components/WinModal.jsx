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
    return ReactDom.createPortal(
        <div className="winModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="winModal">
                <button className="closeModal winButton" onClick={() => setShowWinModal(false)}>X</button>
                <div id="winMessage">
                    {/* could write a conversion method to convert time to minute format */}
                    Congratulations! You completed Puzzly {puzzlyNumber} in {time}{usedHint ? '*' : ''} seconds!
                </div>
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