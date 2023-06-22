import React, { useRef, useState, useEffect } from "react";
import ReactDom from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, fetchFriendsList, getError, getNewFriendName, resetNewFriendName, setError } from "../store/slices/userSlice";
import Toastify from 'toastify-js';

const FriendList = ({ setShowFriendListModal }) => {
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

    // need a thunk to fetch friends list, will call on open and recall when friend added/removed

    useEffect(() => {
        // dispatch fetch friends list
        dispatch(fetchFriendsList())
    },[])

    useEffect(() => {
        if (newFriendName) {
            Toastify({text: `Added ${newFriendName} to friend list!`, duration:2000 ,gravity: "top", position: "center", backgroundColor: "dodgerblue"}).showToast();
            dispatch(resetNewFriendName())
            // clear form here
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
            // need to wait for if this successful or not
        }
        catch (error){
            next(error)
        }
        // need to figure out how to only do this if dispatch successful
        // could do from redux store, but might be ugly
    }

    return ReactDom.createPortal(
        <div className="friendListModalContainer" ref={modalRef} onClick={closeModal}>
            <div id="friendListModal">
                <button className="closeModal" onClick={() => setShowFriendListModal(false)}>X</button>
                <div id="currentFriends">
                    <h4>Current Friends</h4>
                    {friendsList.length ? 
                        <ul id="currentFriendList">
                            {friendsList.map((friend,idx) => (
                                <li className="currentFriend" key={idx}>
                                    {friend.username}
                                    {/* add button to remove them */}
                                </li>
                            ))}
                        </ul>
                        : <></>
                    }
                </div>
                <div id="addFriendContainer">
                    <h4>Add Friend</h4>     
                    <form type="submit" className="addFriendForm" onSubmit={handleSubmit}>
                            <label htmlFor="username" className="username label">
                                Username:
                            </label>
                            <div className="formInput">
                                <input type="text" name="username" placeholder="username" className="textBox" autoFocus="on" required minLength={4} onChange={handleChange('username')}/>
                            </div>
                        
                        <button type="submit" className="addFriendButton" disabled={disableButton()}>
                            Add Friend
                        </button>
                        {/* work on functionality, then on styling */}
                    </form>
                    
                </div>
            </div>
        </div>,
        document.getElementById("portal")
    )
}

export default FriendList