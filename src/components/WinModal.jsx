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
        <div className="hintModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="hintModal">
                <button className="closeModal winButton" onClick={() => setShowWinModal(false)}>X</button>
                <div>
                    {/* could write a conversion method to convert time to minute format */}
                    Congratulations! You completed Puzzly {puzzlyNumber} in {time}{usedHint ? '*' : ''} seconds!
                </div>
                {usedHint ? <div>* denotes hint was used. Try solving future Puzzlys without a hint for a bigger challenge!</div> : <br/>}
                {/* add in copy functionality here later */}
                <button className="shareButton" onClick={()=> {}}>Share Time</button>
                <img id="winModalImg" src={imgUrl}/>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default WinModal