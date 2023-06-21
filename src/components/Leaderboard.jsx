import  React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPuzzlyNumber } from "../store/slices/imageSlice.js";
import { fetchUser, logout } from "../store/slices/userSlice.js";
import LogInModal from "./LogInModal.jsx";
import SignUpModal from "./SignUpModal.jsx";
import Toastify from 'toastify-js';

const Leaderboard = () => {
    const dispatch = useDispatch();
    const currentPuzzlyNum = useSelector(state => state.image.puzzlyNumber)

    const [showLogInModal, setShowLogInModal] =  useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [readyToRender, setReadyToRender] = useState(false);

    const userState = useSelector(state => state.user)

    // add in some toast pop ups for logging in, logging out, etc

    useEffect(() => {
        const token = window.localStorage.getItem('puzzlyToken');
        if (token) {
            dispatch(fetchUser())
        }
        dispatch(fetchCurrentPuzzlyNumber())
    },[])

    useEffect(() => {
        setReadyToRender(true)
        // may also want to wait for userState useSelector to return before this
    },[currentPuzzlyNum])

    const openLogInModal = () => {
        setShowLogInModal(true)
    }

    const openSignUpModal = () => {
        setShowSignUpModal(true)
    }

    const logoutHandler = () => {
        Toastify({text: `Successfully logged out ${userState.userInfo.username}!`, duration:2000 ,gravity: "bottom", position: "center", backgroundColor: "dodgerBlue"}).showToast();
        dispatch(logout())
        // likely some other cleanup once having a friends list state
    }

    return(
        readyToRender ?
        <div id="leaderboardContainer">
            <h2>Leaderboard</h2>
            <h4>Puzzly {currentPuzzlyNum}</h4>
            {!userState.isLoggedIn ?
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
            <div className="leaderboard">
                <div id="leaderboardHeaderRow">
                    <div className="leaderboardHeader">Pos</div>
                    <div className="leaderboardHeader">Name</div>
                    <div className="leaderboardHeader">Time</div>
                </div>
                {/* update this to be dynamic later */}
                {/* will change font-style/size based on if completed or not */}
                <div className="leaderboardRow">
                    <div className="leaderboardPlace">{userState.userInfo.lastComplete === currentPuzzlyNum ? "1" : "*"}</div>
                    <div className="leaderboardName">{`${userState.userInfo.username}(you)`}</div>
                    <div className="leaderboardTime">{userState.userInfo.lastComplete === currentPuzzlyNum ? userState.userInfo.lastCompleted : "----"}</div>
                </div>

                <button id="friendsListButton" type="click" onClick={()=>console.log('hook up modal later!')}>
                    Friends List
                    {/* will probably make a button */}
                    {/* spawn new modal to view friends list and have ability to add more */}
                </button>

                <br/>
                {/* look for a nice log out icon, like exiting door */}
                <button id="logOutButton" type="click" onClick={logoutHandler}>
                    Log Out
                </button>
            </div>
            }
        </div>
        : <></>
    )
}

export default Leaderboard;

// once user log in/log out set up, build out the Leaderboard functionality
// - will need to fetch user friends and their times
// - add an "add friends" button below that pulls up a modal
// --- opens a username search bar, spawns a toast when adding successful
// - could add a log out button as well somewhere on the page