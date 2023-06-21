import  React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPuzzlyNumber } from "../store/slices/imageSlice.js";
import LogInModal from "./LogInModal.jsx";
import SignUpModal from "./SignUpModal.jsx";

const Leaderboard = () => {
    const dispatch = useDispatch();
    const currentPuzzlyNum = useSelector(state => state.image.puzzlyNumber)

    const [showLogInModal, setShowLogInModal] =  useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [readyToRender, setReadyToRender] = useState(false);

    useEffect(() => {
        dispatch(fetchCurrentPuzzlyNumber())
    },[])

    useEffect(() => {
        setReadyToRender(true)
    },[currentPuzzlyNum])

    const user = null
    // will make a useSelector later

    const openLogInModal = () => {
        setShowLogInModal(true)
    }

    const openSignUpModal = () => {
        setShowSignUpModal(true)
    }

    return(
        readyToRender ?
        <div id="leaderboardContainer">
            <h2>Leaderboard</h2>
            <h4>Puzzly {currentPuzzlyNum}</h4>
            {!user ?
            <div className="leaderboard loggedOut">
                {/* may want to make this a datatable instead */}
                <div id="leaderboardHeaderRow">
                    <div className="leaderboardHeader">Pos</div>
                    <div className="leaderboardHeader">Name</div>
                    <div className="leaderboardHeader">Time</div>
                </div>
                <div className="leaderboardRow">
                    <div className="leaderboardPlace">1</div>
                    <div className="leaderboardName">------</div>
                    <div className="leaderboardTime">----</div>
                </div>
                <div className="leaderboardRow">
                    <div className="leaderboardPlace">2</div>
                    <div className="leaderboardName">------</div>
                    <div className="leaderboardTime">----</div>
                </div>
                <div className="leaderboardRow">
                    <div className="leaderboardPlace">3</div>
                    <div className="leaderboardName">------</div>
                    <div className="leaderboardTime">----</div>
                </div>

                <div id="logInSignUpDiv">
                    {/* could make this whoel thing a modal?
                        redirect to home page if user closes the modal
                        also seems unneccessary
                        could just make a blank leaderboard and have the log in/sign up at bottom
                    */}
                    {showLogInModal ? <LogInModal setShowLogInModal={setShowLogInModal} setShowSignUpModal={setShowSignUpModal}/> : null}
                    {showSignUpModal ? <SignUpModal setShowLogInModal={setShowLogInModal} setShowSignUpModal={setShowSignUpModal}/> : null}
                    <div className="logInLink" onClick={openLogInModal}>
                        Log In
                    </div>
                    or
                    <div className="signUpLink" onClick={openSignUpModal}>
                        Sign Up
                    </div>
                    to access leaderboard.
                </div>
            </div>
            :
            <div>Leaderboard here</div>
            }
        </div>
        : <></>
    )
}

export default Leaderboard;