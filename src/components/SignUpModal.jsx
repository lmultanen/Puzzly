import  React, { useRef, useState, useEffect }  from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReactDom from "react-dom";
import { createUser, fetchUser, getFormInputAvailable, validateSignupForm } from "../store/slices/userSlice";

const SignUpModal = ({ setShowLogInModal, setShowSignUpModal }) => {
    const dispatch = useDispatch();
    const [signUp, setSignUp] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const validate = useSelector(getFormInputAvailable);

    const token = useSelector(state => state.user.token)
    
    useEffect(() => {}, [validate]);

    useEffect(() => {
        console.log(token)
        if (token) {
            dispatch(fetchUser())
            setShowSignUpModal(false)
        }
    },[token])

    const handleChange = (prop) => (event) => {
		const password = document.querySelector('input[name=password]');
		const confirm = document.querySelector('input[name=confirm_password]');
		setSignUp({
			...signUp,
			[prop]: event.target.value,
		});
		// if (confirm?.value === password?.value) {
		// 	confirm.setCustomValidity('');
		// } else {
		// 	confirm?.setCustomValidity('Passwords do not match!');
		// }
        // if (signUp.password === signUp.confirmPassword) {
		// 	confirm.setCustomValidity('');
		// } else {
		// 	confirm.setCustomValidity('Passwords do not match!');
		// }
	};

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
        // if successful, close modal
        // if not successful, then send toast that unsuccessful
		// dispatch(createUser({ signUp })) && navigate('/login');
	};

    const handleLogin = () => {
		// navigate('/login');
        // 
        // IF SUCCESSFUL, THEN POP UP A TOAST AND CLOSE THE TAB
        setShowSignUpModal(false)
	};
    
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
            <div id="signUpModal">
                <button className="closeModal" onClick={() => setShowSignUpModal(false)}>X</button>
                {/* <img id="logInModalImg" src={imgUrl}/> */}
                {/* <div>Username:</div>
                <div>Password:</div>
                <div>Verify Password:</div> */}
                <div className="signUpContainer">
                    <h2>Sign Up</h2>
                    <p>Input Username and Password to create account.</p>
                    <br/>
                    <form onSubmit={handleSubmit} autoComplete="on">
                        <div className="formBox">
                            <label htmlFor="username" className="username label">
                                Username:
                            </label>
                            <div className="formInput">
                                <input type="text" name="username" placeholder="username" className="textBox" autoFocus="on" required minLength={4} onChange={handleChange('username')} onBlur={handleAdditionalValidate('username')}/>
                            </div>
                        </div>

                        {!validate['username'] && (
							<p style={{ color: `red` }}>
								<b>Username is Taken</b>
							</p>
						)}

                        <div className="formBox">
                            <label htmlFor="password" className="password label">
                                Password:
                            </label>
                            <div className="formInput">
                                <input type="Password" name="password" placeholder="Password" className="textBox" autoFocus="on" required minLength={6} onChange={handleChange('password')}/>
                            </div>
                        </div>

                        <div className="formBox">
                            <label htmlFor="confirm_password" className="password label">
                                Confirm Password:
                            </label>
                            <div className="formInput">
                                <input type="Password" name="confirmPassword" placeholder="Confirm Password" className="textBox" autoFocus="on" required minLength={6} onChange={handleChange('confirmPassword')}/>
                            </div>
                        </div>

                        <div className="box">
							<button
								type="Submit"
								name="Register"
								className="submit"
								disabled={
									// !validate['username'] ? true : ''
                                    disableButton()
								}
							>
								Sign Up
							</button>
							{/* <button onClick={handleLogin}>Login</button> */}
						</div>
                    </form>
                </div>
                <br/>
                <div className="switchModalDiv">
                    Already have an account? <div className="logInLink" onClick={switchModal}>Log In</div> here!
                </div>
                
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default SignUpModal;