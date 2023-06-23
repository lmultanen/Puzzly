import React, { useRef, useState, useEffect } from "react";
import ReactDom from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, fetchFriendsList, getError, getNewFriendName, removeFriend, resetNewFriendName, setError } from "../store/slices/userSlice";
import Toastify from 'toastify-js';

const FriendList = ({ setShowFriendListModal, darkMode }) => {
    const dispatch = useDispatch()
    const modalRef = useRef();
    const loginError = useSelector(getError)
    const newFriendName = useSelector(getNewFriendName)

    const closeModal = (e) => {
        if (e.target === modalRef.current) {
            setShowFriendListModal(false)
        }
    }

    const [friendForm, setFriendForm] = useState({
        username: ''
    })

    const friendsList = useSelector(state => state.user.friends)

    useEffect(() => {
        dispatch(fetchFriendsList())
    },[])

    useEffect(() => {
        if (newFriendName) {
            Toastify({text: `Added ${newFriendName} to friend list!`, duration:2000 ,gravity: "top", position: "center", backgroundColor: "dodgerblue"}).showToast();
            dispatch(resetNewFriendName())
            setFriendForm({username: ''})
            document.querySelector("[name='username']").value = '';
        }
    }, [newFriendName])

    useEffect(() => {
        if (loginError) {
            Toastify({text: "User Not Found", duration:1000 ,gravity: "bottom", position: "center", backgroundColor: "red"}).showToast();
            dispatch(setError())
        }
    }, [loginError])

    const handleChange = (prop) => (event) => {
        let value = event.target.value;
        if (prop == "username") {
            value = value.toLowerCase();
          }
		setFriendForm({
			...friendForm,
			[prop]: event.target.value,
		});
	};

    const disableButton = () => {
        return !(friendForm.username.length >= 4)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            dispatch(addFriend({
                friend: friendForm
            }))
        }
        catch (error){
            next(error)
        }
    }

    const removeFriendHandler = (friendId, name) => {
        console.log('removing friend')
        dispatch(removeFriend({friendId}))
        Toastify({text: `Removed ${name} from friend list.`, duration:2000 ,gravity: "top", position: "center", backgroundColor: "red"}).showToast();
    }

    return ReactDom.createPortal(
        <div className="friendListModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="friendListModal"  className={darkMode ? "darkMode" : ""}>
                <button className="closeModal" onClick={() => setShowFriendListModal(false)}>X</button>
                <div id="currentFriends"  className={darkMode ? "darkMode" : ""}>
                    <h4>Current Friends</h4>
                    {friendsList.length ? 
                        <ul id="currentFriendList"  className={darkMode ? "darkMode" : ""}>
                            {friendsList.map((friend,idx) => (
                                <li className="currentFriend" key={idx}>
                                    <span className="removeFriendButton" onClick={() => removeFriendHandler(friend.id,friend.username)}>
                                        X
                                    </span>
                                    {friend.username}
                                </li>
                            ))}
                        </ul>
                        : <></>
                    }
                </div>
                <div id="addFriendContainer">
                    <h4>Add Friend</h4>     
                    <form type="submit" className="addFriendForm" onSubmit={handleSubmit}>
                            <label style={{ fontSize: "small"}} htmlFor="username" className="username label">
                                Input Username:
                            </label>
                            <div className="formInput">
                                <input type="text" name="username" placeholder="username" className="textBox" autoFocus="on" required minLength={4} onChange={handleChange('username')}/>
                            </div>
                        <div className="buttonDiv">
                            <button type="submit" className="addFriendButton" disabled={disableButton()}>
                                Add Friend
                            </button>
                        </div>
                    </form>
                    
                </div>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default FriendList