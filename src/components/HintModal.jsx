import React, { useRef } from "react";
import ReactDom from "react-dom";

const HintModal = ({setShowHintModal, imgUrl}) => {
    const modalRef = useRef();
    const closeModal = (e) => {
        if (e.target === modalRef.current) {
            setShowHintModal(false)
        }
    }
    return ReactDom.createPortal(
        <div className="hintModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="hintModal">
                <button className="closeModal" onClick={() => setShowHintModal(false)}>X</button>
                <img id="hintModalImg" src={imgUrl}/>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default HintModal