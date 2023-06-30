import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser } from "../../store/slices/userSlice";
import Toastify from 'toastify-js';

const AdminPortal = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchUser());
    },[])

    useEffect(() => {
        const token = window.localStorage.getItem('puzzlyToken');
        if ((user.isLoggedIn && !user.isAdmin) || !token) {
            // navigate home
            // popup toast "not authorized to access admin portal"
            Toastify({text: "Not Authorized to access Admin Portal", duration:2000 ,gravity: "top", position: "middle", backgroundColor: "red"}).showToast();
            navigate("/");
        }
    },[user.isLoggedIn])

    return( user.isAdmin ?
        <div>Placeholder for admin portal; will add button to view all users next
            <Link to={"users"}><button>All Users</button></Link>
        </div>
        :
        null
    )
}

export default AdminPortal;