import React from 'react';
import RouteComponent from './components/RouteComponent.jsx';

const App = () => {
    return(
        <>
            <div id="main">
                <RouteComponent />
                {/* could add some toasts and stuff here, just for error handling */}
            </div>
        </>
    );
}

export default App;