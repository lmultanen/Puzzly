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

    return(
        (readyToRender && currentPuzzlyNum) ?
         (currentPuzzlyNum !== lastLocalCompleted) ?
            <div className="home-container">
                <img id="puzzlyLogo" src="puzzlyLogo.png"/>
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
                <img id="puzzlyLogo" src="puzzlyLogo.png"/>
                <h3>
                    Congrats Solving Today's Puzzly
                </h3>
                <p>
                    Check out the Leaderboard to see how you stack up against your friends!
                </p>
                <Link className="homeLink" to="/play">
                    <button className="playButton">See Puzzly</button>
                </Link>
            </div>
        :
        <></>
        
    );
}

export default Home;