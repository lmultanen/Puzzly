import React, { useRef } from "react";
import ReactDom from "react-dom";
// will need to import thunks from userSlice to attempt to log in

const LogInModal = ({ setShowLogInModal, setShowSignUpModal }) => {
    const modalRef = useRef();
    const closeModal = (e) => {
        if (e.target === modalRef.current) {
            setShowLogInModal(false)
        }
    }

    const switchModal = () => {
        setShowLogInModal(false);
        setShowSignUpModal(true);
    }

    return ReactDom.createPortal(
        <div className="logInModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="logInModal">
                <button className="closeModal" onClick={() => setShowLogInModal(false)}>X</button>
                {/* <img id="logInModalImg" src={imgUrl}/> */}
                <div>Username:</div>
                <div>Password:</div>
                <br/>
                <div className="switchModalDiv">
                    Don't have an account? <div className="signUpLink" onClick={switchModal}>Sign Up</div> here!
                </div>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default LogInModal;