import React, { useRef, useEffect, useState } from "react";
import ReactDom from "react-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchFriendsList, fetchUser, getError, loginUser, setError } from "../store/slices/userSlice";
import Toastify from 'toastify-js';

const LogInModal = ({ setShowLogInModal, setShowSignUpModal }) => {
    const dispatch = useDispatch();
    const [login, setLogin] = useState({
        username: '',
        password: ''
    });

    const token = useSelector(state => state.user.token)
    const loginError = useSelector(getError)

    useEffect(() => {
        if (token) {
            dispatch(fetchUser())
            dispatch(fetchFriendsList())
            setShowLogInModal(false)
            Toastify({text: `Welcome back, ${login.username}!`, duration:2000 ,gravity: "top", position: "right", backgroundColor: "dodgerBlue"}).showToast();
        }
    },[token])

    useEffect(() => {
        if (loginError) {
            Toastify({text: "Invalid log in credentials", duration:1500 ,gravity: "bottom", position: "center", backgroundColor: "red"}).showToast();
            dispatch(setError())

        }
    }, [loginError])

    const modalRef = useRef();
    const closeModal = (e) => {
        if (e.target === modalRef.current) {
            setShowLogInModal(false)
        }
    }

    const switchModal = () => {
        setShowLogInModal(false);
        setShowSignUpModal(true);
    }

    const handleChange = (prop) => (event) => {
        let value = event.target.value;
        if (prop == "username") {
            value = value.toLowerCase();
          }
		setLogin({
			...login,
			[prop]: event.target.value,
		});
	};

    const handleSubmit = (event) => {
		event.preventDefault();
        dispatch(loginUser({ login }))
	};

    const disableButton = () => {
        return !(
            (login.password.length >= 6) &&
            (login.username.length >= 4)
        )
    }

    return ReactDom.createPortal(
        <div className="logInModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="logInModal">
                <button className="closeModal" onClick={() => setShowLogInModal(false)}>X</button>
                <div className="logInContainer">
                    <form onSubmit={handleSubmit} autoComplete="on">
                        <div id="userPassLogInDiv">
                            <div className="formBox login">
                                <label htmlFor="username" className="username label">
                                    Username:
                                </label>
                                <div className="formInput">
                                    <input type="text" name="username" placeholder="username" className="textBox" autoFocus="on" required minLength={4} onChange={handleChange('username')}/>
                                </div>
                            </div>
                            <div className="formBox login">
                                <label htmlFor="password" className="password label">
                                    Password:
                                </label>
                                <div className="formInput">
                                    <input type="Password" name="password" placeholder="Password" className="textBox" required minLength={6} onChange={handleChange('password')}/>
                                </div>
                            </div>
                        </div>
                        <div className="formBox">
                            <button type="Submit" className="logInButton" disabled={disableButton()}>
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
                <div className="switchModalDiv">
                    Don't have an account? <div className="signUpLink" onClick={switchModal}>Sign Up</div> here!
                </div>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default LogInModal;