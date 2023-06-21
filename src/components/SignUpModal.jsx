import  React, { useRef }  from "react";
import ReactDom from "react-dom";

const SignUpModal = ({ setShowLogInModal, setShowSignUpModal }) => {
    const modalRef = useRef();
    const closeModal = (e) => {
        if (e.target === modalRef.current) {
            setShowLogInModal(false)
        }
    }

    const switchModal = () => {
        setShowSignUpModal(false);
        setShowLogInModal(true);
    }

    return ReactDom.createPortal(
        <div className="signUpModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="signUpModal">
                <button className="closeModal" onClick={() => setShowSignUpModal(false)}>X</button>
                {/* <img id="logInModalImg" src={imgUrl}/> */}
                <div>Username:</div>
                <div>Password:</div>
                <div>Verify Password:</div>
                <br/>
                <div className="switchModalDiv">
                    Already have an account? <div className="logInLink" onClick={switchModal}>Log In</div> here!
                </div>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default SignUpModal;