import  React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPuzzlyNumber } from "../store/slices/imageSlice.js";
import { fetchFriendsList, fetchUser, logout, addLocalPuzzlyResults } from "../store/slices/userSlice.js";
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
    const friendsList = useSelector(state => state.user.friends)
    const [fillerList, setFillerList] = useState([1,2,3,4,5])
    const [completedList, setCompletedList] = useState([])
    const [uncompletedList, setUncompletedList] = useState([])
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const token = window.localStorage.getItem('puzzlyToken');
        if (token) {
            dispatch(fetchUser())
            dispatch(fetchFriendsList())
        }
        dispatch(fetchCurrentPuzzlyNumber())
        if (window.localStorage.getItem('puzzlyDarkMode') === 'true') {
            setDarkMode(true)
        }
    },[])

    useEffect(() => {
        const localPuzzlyHistory = JSON.parse(window.localStorage.getItem('puzzlyHistory'));
        if (userState.isLoggedIn && localPuzzlyHistory?.length && currentPuzzlyNum) {
            window.localStorage.setItem('puzzlyStreak',0);
            window.localStorage.setItem('averagePuzzlyTime',window.localStorage.getItem('lastCompletedPuzzlyTime'));
            dispatch(addLocalPuzzlyResults({
                results: {
                    userId: userState.userInfo.id,
                    history: localPuzzlyHistory,
                    currentPuzzly: currentPuzzlyNum
                }
            }))
        }
    },[userState.isLoggedIn, currentPuzzlyNum])

    useEffect(() => {
        if (currentPuzzlyNum && 
           ( ((userState.status === "succeeded") && userState.isLoggedIn) || !userState.isLoggedIn )) {
            if (userState.isLoggedIn) {
                const filler = [];
                for (let i = 0; i<5-(friendsList.length + 1); i++) {
                    filler.push(5-i)
                }
                setFillerList(filler)
                generateLeaderBoardLists()
            }   
            setReadyToRender(true)
        }
        if (!userState.isLoggedIn) {
            setFillerList([1,2,3,4,5])
        }
    },[currentPuzzlyNum,userState.isLoggedIn,friendsList.length,userState.userInfo.lastCompleted])

    const generateLeaderBoardLists = () => {
        let completed = friendsList.filter(friend => friend.lastCompleted === currentPuzzlyNum)
        let uncompleted = friendsList.filter(friend => friend.lastCompleted !== currentPuzzlyNum)
        userState.userInfo.lastCompleted === currentPuzzlyNum ? completed.push(userState.userInfo) : uncompleted.unshift(userState.userInfo)
        // Could choose to trim results, but for now, showing all
        // Choosing to not sort uncompleted for now, so that user stays near the top
        completed.sort((a,b) => (a.lastTime - b.lastTime))
        setCompletedList(completed)
        setUncompletedList(uncompleted)
    }

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
                            <th className="leaderboardHeader leaderboardName">Name</th>
                            <th className="leaderboardHeader">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fillerList.map((val, idx) => (
                            <tr className="leaderboardRow" key={idx}>
                                <td className="leaderboardPlace">*</td>
                                <td className="leaderboardName">------</td>
                                <td className="leaderboardTime">------</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div id="logInSignUpDiv">
                    {showLogInModal ? <LogInModal setShowLogInModal={setShowLogInModal} setShowSignUpModal={setShowSignUpModal} darkMode={darkMode}/> : null}
                    {showSignUpModal ? <SignUpModal setShowLogInModal={setShowLogInModal} setShowSignUpModal={setShowSignUpModal} darkMode={darkMode}/> : null}
                    <div className={darkMode ? "logInLink darkMode" : "logInLink"} onClick={openLogInModal}>
                        Log In
                    </div>
                    or
                    <div className={darkMode ? "signUpLink darkMode" : "signUpLink"} onClick={openSignUpModal}>
                        Sign Up
                    </div>
                    to access leaderboard.
                </div>
            </div>
            :
            <div className="leaderboard">
                <table className="leaderboardTable">
                    <thead>
                        <tr id="leaderboardHeaderRow">
                            <th className="leaderboardHeader">Pos</th>
                            <th className="leaderboardHeader leaderboardName">Name</th>
                            <th className="leaderboardHeader">Time</th>
                        </tr>
                    </thead>
                    <tbody className={friendsList.length > 10 ? "tableBorder" : ""}>
                        {completedList.map((user, idx) => (
                            <tr className="leaderboardRow" key={idx}>
                                <td className="leaderboardPlace">{idx+1}</td>
                                <td className="leaderboardName">{user.username === userState.userInfo.username ? `${user.username} (you)` : user.username}</td>
                                <td className="leaderboardTime">{`${convertSecsToMins(user.lastTime)}${user.usedHint ? '*' : ''}`}</td>
                            </tr>
                        ))}
                        {uncompletedList.map((user, idx) => (
                            <tr className="leaderboardRow" key={idx}>
                                <td className="leaderboardPlace unfinished">*</td>
                                <td className="leaderboardName unfinished">{user.username === userState.userInfo.username ? `${user.username} (you)` : user.username}</td>
                                <td className="leaderboardTime unfinished">-------</td>
                            </tr>
                        ))}
                        {fillerList.map((val, idx) => (
                            <tr className="leaderboardRow" key={idx}>
                                <td className="leaderboardPlace filler">*</td>
                                <td className="leaderboardName filler">------</td>
                                <td className="leaderboardTime filler">-------</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showFriendListModal ? <FriendList setShowFriendListModal={setShowFriendListModal} darkMode={darkMode}/> : null}
                <button id="friendsListButton" type="click" onClick={openFriendListModal}>
                    Friends List
                </button>

                <br/>
                <button id="logOutButton" className={darkMode ? "darkMode" : ""} type="click" onClick={logoutHandler}>
                    Log Out
                </button>
            </div>
            }
        </div>
        : <></>
    )
}

export default Leaderboard;