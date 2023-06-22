import  React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPuzzlyNumber } from "../store/slices/imageSlice.js";
import { fetchUser, logout } from "../store/slices/userSlice.js";
import LogInModal from "./LogInModal.jsx";
import SignUpModal from "./SignUpModal.jsx";
import Toastify from 'toastify-js';
import FriendList from "./FriendList.jsx";

const Leaderboard = () => {
    const dispatch = useDispatch();
    const currentPuzzlyNum = useSelector(state => state.image.puzzlyNumber)

    const [showLogInModal, setShowLogInModal] =  useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showFriendListModal, setShowFriendListModal] = useState(false);
    const [readyToRender, setReadyToRender] = useState(false);

    const userState = useSelector(state => state.user)

    // will change this to a use selector later
    const [friendsList, setFriendsList] = useState([])
    const [fillerList, setFillerList] = useState([1,2,3,4,5])

    // add in some toast pop ups for logging in, logging out, etc

    useEffect(() => {
        const token = window.localStorage.getItem('puzzlyToken');
        if (token) {
            dispatch(fetchUser())
        }
        dispatch(fetchCurrentPuzzlyNumber())
    },[])

    useEffect(() => {
        if (currentPuzzlyNum && 
           ( ((userState.status === "succeeded") && userState.isLoggedIn) || !userState.isLoggedIn )) {
            if (userState.isLoggedIn) {
                const filler = [];
                for (let i = 0; i<5-(friendsList.length + 1); i++) {
                    filler.push(5-i)
                }
                setFillerList(filler)
            }
            setReadyToRender(true)
        }
        if (!userState.isLoggedIn) {
            setFillerList([1,2,3,4,5])
        }
        // may also want to wait for userState useSelector to return before this
    },[currentPuzzlyNum,userState.isLoggedIn])

    const openLogInModal = () => {
        setShowLogInModal(true)
    }

    const openSignUpModal = () => {
        setShowSignUpModal(true)
    }

    const openFriendListModal = () => {
        setShowFriendListModal(true)
    }

    const logoutHandler = () => {
        Toastify({text: `Successfully logged out ${userState.userInfo.username}!`, duration:2000 ,gravity: "bottom", position: "center", backgroundColor: "dodgerBlue"}).showToast();
        dispatch(logout())
        // likely some other cleanup once having a friends list state
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

    return(
        readyToRender ?
        <div id="leaderboardContainer">
            <h2>Leaderboard</h2>
            <h4>Puzzly {currentPuzzlyNum}</h4>
            {!userState.isLoggedIn ?
            <div className="leaderboard loggedOut">
                <table className="leaderboardTable loggedOut">
                    <thead>
                        <tr id="leaderboardHeaderRow">
                            <th className="leaderboardHeader">Pos</th>
                            <th className="leaderboardHeader">Name</th>
                            <th className="leaderboardHeader">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fillerList.map((val, idx) => (
                            <tr className="leaderboardRow" key={idx}>
                                <td className="leaderboardPlace">*</td>
                                <td className="leaderboardName">------</td>
                                <td className="leaderboardTime">----</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div id="logInSignUpDiv">
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
                <table className="leaderboardTable loggedOut">
                    <thead>
                        <tr id="leaderboardHeaderRow">
                            <th className="leaderboardHeader">Pos</th>
                            <th className="leaderboardHeader">Name</th>
                            <th className="leaderboardHeader">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* filler working appropriately */}
                            <tr className="leaderboardRow">
                                <td className={userState.userInfo.lastCompleted !== currentPuzzlyNum ? "leaderboardPlace unfinished" :"leaderboardPlace"}>{userState.userInfo.lastCompleted === currentPuzzlyNum ? "1" : "*"}</td>
                                <td className={userState.userInfo.lastCompleted !== currentPuzzlyNum ? "leaderboardName unfinished" :"leaderboardName"}>{`${userState.userInfo.username} (you)`}</td>
                                <td className={userState.userInfo.lastCompleted !== currentPuzzlyNum ? "leaderboardTime unfinished" :"leaderboardTime"}>{userState.userInfo.lastCompleted === currentPuzzlyNum ? convertSecsToMins(userState.userInfo.lastTime) : "----"}</td>
                            </tr>
                            {/* map friends list here */}
                            {/* in truth, should insert player into friends list */}
                        {fillerList.map((val, idx) => (
                            <tr className="leaderboardRow" key={idx}>
                                <td className="leaderboardPlace">*</td>
                                <td className="leaderboardName">------</td>
                                <td className="leaderboardTime">----</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showFriendListModal ? <FriendList setShowFriendListModal={setShowFriendListModal}/> : null}
                <button id="friendsListButton" type="click" onClick={openFriendListModal}>
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

// could add a render to render bool here too; otherwise flashes for a second