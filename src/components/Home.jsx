import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentPuzzlyNumber } from "../store/slices/imageSlice";

const Home = () => {
    const dispatch = useDispatch()
    const currentPuzzlyNum = useSelector(state => state.image.puzzlyNumber)
    const lastLocalCompleted = Number(window.localStorage.getItem('lastCompletedPuzzly'))

    const [readyToRender, setReadyToRender] = useState(false)

    useEffect(() => {
        const currentTimer = window.localStorage.getItem('currentPuzzlyTimer');
        if (!currentTimer) {
            window.localStorage.setItem('currentPuzzlyTimer', '0');
        }
        console.log(lastLocalCompleted)
        dispatch(fetchCurrentPuzzlyNumber());
    },[])

    useEffect(() => {
        setReadyToRender(true)
    },[currentPuzzlyNum])
    // should see what happens when no local storage for anything

    // could grab local storage for lastCompletedPuzzly
    // based on that and fetching currentPuzzlyNum, could either display a play button or not

    // similar to wordle, could change the home page based on whether it was done or not
    // could also change the button from "Play" to "See Puzzly"

    return(
        (readyToRender && currentPuzzlyNum) ?
         (currentPuzzlyNum !== lastLocalCompleted) ?
            <div className="home-container">
                {/* <div className="nav-buffer"/> */}
                {/* <h2>Placeholder home page. Will later add a couple buttons (at least), one of which takes users to a page or opens a popup for the Rules, and the other takes users to the 'Play' page, where they will be able to solve the day's Puzzly.</h2> */}
                <h1>
                    {`Puzzly #${currentPuzzlyNum}`}
                </h1>
                <Link className="homeLink" to="/play">
                    <button className="playButton">Play</button>
                </Link>
                <Link className="homeLink" to="/rules">
                    <button className="rulesButton">Rules</button>
                </Link>
            </div>
            :
            <div className="home-container solved">
                <h3>
                    Congrats Solving Today's Puzzly
                </h3>
                <p>
                    Check out the Leaderboard to see how you stack up against your friends!
                </p>
                <Link className="homeLink" to="/play">
                    <button className="playButton">See Puzzly</button>
                </Link>
                {/* <Link className="homeLink" to="/rules">
                    <button className="rulesButton">Rules</button>
                </Link> */}
            </div>
        :
        <></>
        
    );
}

export default Home;

// may want to check/load local puzzly history after sign in 