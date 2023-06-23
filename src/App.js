import React, {useEffect} from 'react';
import RouteComponent from './components/RouteComponent.jsx';

const App = () => {
    useEffect(() => {
        const darkMode = window.localStorage.getItem('puzzlyDarkMode')
        if (darkMode === 'true') {
            document.body.className = "darkMode"
        }
    },[])

    return(
        <>
            <div id="main">
                <RouteComponent />
                {/* icon={false} */}
            </div>
        </>
    );
}

export default App;