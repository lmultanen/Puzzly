import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./Home.jsx";
import Play from "./Play.jsx";
import Nav from "./Nav.jsx";
import Rules from "./Rules.jsx";

const RouteComponent = () => {
    return(
        <>
            <Nav />
            <Routes>
                <Route index element={<Home />}/>
                <Route path="/play" element={<Play />}/>
                <Route path="/rules" element={<Rules />}/>
                {/* Can include some error handling/catch all; maybe just redirect to home */}
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </>
    )
}

export default RouteComponent;