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
            document.body.className = "darkMode"
        }
        else {
            document.body.className = ""
        }
    }, [darkMode])

    const toggleDarkMode = () => {
        !darkMode ? window.localStorage.setItem('puzzlyDarkMode','true') : window.localStorage.setItem('puzzlyDarkMode','false') 
        setDarkMode(!darkMode)
    }

    return(
        <div id="settingsContainer">
            <h2>
                Settings:
            </h2>

            <div className="settingDiv">
                <label id="darkModeToggleLabel">
                    Dark Mode:
                </label>
                <button type="toggle" id="darkModeToggle" className={darkMode ? "darkMode" : ""} onClick={toggleDarkMode}>{darkMode ? "Disable" : "Enable"}</button>
            </div>
        </div>
    )
}

export default Settings;
