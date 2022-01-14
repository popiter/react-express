import React, {useState, useEffect, useContext, useCallback} from 'react';
import useHttp from '../../hooks/http.hook'
import LoaderCircular from '../loader/loaderCircular'
import {AuthContext} from "../../context/AuthContext"
import {UserCard} from '../detailsOfPage'
import useMessage from '../../hooks/message.hook'
import {useHistory} from "react-router-dom";

const AllUsers = () => {
    const {request, loading} = useHttp()
    const [users, setUsers] = useState([]);
    const {token, logout} = useContext(AuthContext);
    const message = useMessage()
    const history = useHistory()

    const getUsers = useCallback(async () => {
        try {
            const users = await request('/api/admin/users', 'GET', null, {Authorization: `Bearer ${token}`})
            setUsers(users)
        } catch (e) {
        }
    }, [request, token])

    const deleteUser = async (id) => {
        try {
            await request(`/api/admin/deleteUser?id=${id}`, 'GET', null, {Authorization: `Bearer ${token}`})
            const idx = users.findIndex(user => user._id === id)
            setUsers([
                ...users.slice(0, idx),
                ...users.slice(idx + 1)
            ])
            message('Пользователь удален')
        } catch (e) {
            if (e.message === 'Текущая сессия закончилась') {
                setTimeout(() => {
                    logout()
                    history.push('/login')
                }, 1000)
            }
        }
    }

    useEffect(() => {
        document.title = 'Все пользователи'
        getUsers()
    }, [getUsers]);



    return (
        loading ? <LoaderCircular/> : <UserCard deleteUser={deleteUser} users={users}/>
    )
}

export default AllUsers
