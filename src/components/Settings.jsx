import React, { useState, useEffect } from "react";


const Settings = () => {

    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const savedDarkMode = window.localStorage.getItem('puzzlyDarkMode')
        if (savedDarkMode === 'true') {
            setDarkMode(true)
        }
    },[])

    useEffect(() => {
        if (darkMode) {
            // document.getElementById("main").className = "darkMode"
            document.body.className = "darkMode"
        }
        else {
            // document.getElementById("main").className = ""
            document.body.className = ""
        }
    }, [darkMode])

    const toggleDarkMode = () => {
        !darkMode ? window.localStorage.setItem('puzzlyDarkMode','true') : window.localStorage.setItem('puzzlyDarkMode','false') 
        setDarkMode(!darkMode)
    }

    return(
        <div id="settingsContainer">
            placeholder for settings page
            probably only 2 settings: wiggle on/off, and light/dark mode
            could probably just save it to local storage

            <button type="toggle" onClick={toggleDarkMode}>Toggle Light/Dark</button>
        </div>
    )
}

export default Settings;

// will need to change hint link color, likely to white
// need to change grid color
// also likely change the tile bank background color