import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAllUsersState, fetchAllUsers } from "../../store/slices/adminSlice";
import { fetchUser } from "../../store/slices/userSlice";

const AllUsers = () => {
    const users = useSelector(state => state.admin.allUsers)
    const numUsers = useSelector(state => state.admin.numUsers);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [usersList,setUsersList] = useState([]);

    useEffect(() => {
        setUsersList(users)
    },[users])

    useEffect(() => {
        const token = window.localStorage.getItem('puzzlyToken');
        if ((user.isLoggedIn && !user.isAdmin) || !token) {
            Toastify({text: "Not Authorized to access Admin Portal", duration:2000 ,gravity: "top", position: "middle", backgroundColor: "red"}).showToast();
            navigate("/");
        }
    },[user.isLoggedIn])

    useEffect(() => {
        dispatch(fetchUser());
        console.log('fetching user')
        if (user.isAdmin) {
            console.log('user is admin')
            dispatch(fetchAllUsers({}));
        }
        return () => {
            dispatch(clearAllUsersState());
        }
    },[user.isAdmin])

    return (
        usersList.length ? 
            <div>
                <h1>{`Total users: ${numUsers}`}</h1>
                {usersList.map((user,idx) => {
                return(
                    <div key={idx}>{`${idx+1}: ${user.username}`}</div>
                )
                })}
            </div>
        :
        null
    )
}

export default AllUsers;