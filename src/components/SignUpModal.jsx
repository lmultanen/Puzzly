import  React, { useRef, useState, useEffect }  from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReactDom from "react-dom";
import { createUser, fetchUser, getError, setError, getFormInputAvailable, validateSignupForm } from "../store/slices/userSlice";

const SignUpModal = ({ setShowLogInModal, setShowSignUpModal, darkMode }) => {
    const dispatch = useDispatch();
    const [signUp, setSignUp] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const validate = useSelector(getFormInputAvailable);

    const token = useSelector(state => state.user.token)
    const loginError = useSelector(getError)
    
    useEffect(() => {}, [validate]);

    useEffect(() => {
        if (loginError) {
            Toastify({text: "Error creating account, please try again.", duration:2000 ,gravity: "bottom", position: "center", backgroundColor: "red"}).showToast();
            dispatch(setError())
        }
    }, [loginError])

    useEffect(() => {
        if (token) {
            dispatch(fetchUser())
            Toastify({text: `Account created! Welcome, ${signUp.username}!`, duration:2000 ,gravity: "bottom", position: "center", backgroundColor: "dodgerBlue"}).showToast();
            setShowSignUpModal(false)
        }
    },[token])

    const handleChange = (prop) => (event) => {
		setSignUp({
			...signUp,
			[prop]: event.target.value,
		});
	};

    // HOOK UP THE BACKEND VALIDATOR BETTER


    const disableButton = () => {
        return !(
            (signUp.password === signUp.confirmPassword) &&
            (signUp.password.length >= 6) &&
            (signUp.username.length >= 4)
        )
    }

    const handleAdditionalValidate = (prop) => (event) => {
		const value = event.target.value;
		value.length >= 4 && dispatch(validateSignupForm({ prop, value }));
	};

    const handleSubmit = (event) => {
		event.preventDefault();
        dispatch(createUser({ signUp }))
	};

    const passwordsEqual = () => {
        if (!signUp.confirmPassword.length) {
            return true
        }
        return signUp.password === signUp.confirmPassword
    }

    const passwordRequirements = () => {
        if (!signUp.password.length) {
            return true
        }
        return (signUp.password.length >= 6) && !(/\s/g.test(signUp.password))
    }

    const usernameRequirements = () => {
        if (!signUp.username.length) {
            return true
        }
        let alphanumeric = new RegExp(/^[a-z0-9]+$/i)
        return ((signUp.username.length >=4) && (signUp.username.length <=32) && alphanumeric.test(signUp.username))
    }
    
    const modalRef = useRef();


    const closeModal = (e) => {
        if (e.target === modalRef.current) {
            setShowLogInModal(false)
        }
    }

    const switchModal = () => {
        setShowSignUpModal(false);
        setShowLogInModal(true);
    }

    return ReactDom.createPortal(
        <div className="signUpModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="signUpModal" className={darkMode ? "darkMode" : ""}>
                <button className="closeModal" onClick={() => setShowSignUpModal(false)}>X</button>
                <div className="signUpContainer">
                    <h2>New User Form</h2>
                    <p style={{fontStyle: "italic"}}>Input Username and Password to create account.</p>
                    <br/>
                    <form onSubmit={handleSubmit} autoComplete="on">
                        <div className="formBox">
                            <label htmlFor="username" className="username label">
                                Username:
                                {!(validate['username']) && signUp.username.length >=4 ? <span id='usernameTaken'>Username taken</span> : null}
                                {usernameRequirements() ? null : <img className="warningMsg" src="warning.svg" title="Must be between 4 and 32 alphanumeric characters"/>}
                            </label>
                            <div className="formInput">
                                <input type="text" name="username" placeholder="username" className="textBox" autoFocus="on" required minLength={4} onChange={handleChange('username')} onBlur={handleAdditionalValidate('username')}/>
                            </div>
                        </div>

                        <div className="formBox">
                            <label htmlFor="password" className="password label">
                                Password:
                                {passwordRequirements() ? null : <img className="warningMsg" src="warning.svg" title="Must be at least 6 characters; whitespace not allowed"/>}
                            </label>
                            <div className="formInput">
                                <input type="Password" name="password" placeholder="Password" className="textBox" required minLength={6} onChange={handleChange('password')}/>
                            </div>
                        </div>

                        <div className="formBox">
                            <label htmlFor="confirm_password" className="password label">
                                Confirm Password:
                                {passwordsEqual() ? null : <span><img className="warningMsg" src="warning.svg" title="Passwords Do Not Match"/></span>}
                            </label>
                            <div className="formInput">
                                <input type="Password" name="confirmPassword" placeholder="Confirm Password" className="textBox" required minLength={6} onChange={handleChange('confirmPassword')}/>
                            </div>
                        </div>

                        <div className="formBox button">
							<button
								type="Submit"
								name="Register"
								className="signUpButton"
								disabled={disableButton()}>
								Sign Up
							</button>
						</div>
                        <div id="userPassReqs">
                            *Username must be 4-32 alphanumeric characters in length, password must be at least 6 characters long and cannot contain whitespace.
                        </div>
                    </form>
                </div>
                <br/>
                <div className="switchModalDiv">
                    Already have an account? <div className={darkMode ? "logInLink darkMode" : "logInLink"} onClick={switchModal}>Log In</div> here!
                </div>
                
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default SignUpModal;