import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import M from 'materialize-css'
import PersonalProfiles from "./personalProfiles";
import useIsAuth from "../../hooks/isAuth.hook";
import {useHistory} from "react-router-dom";
import Customization from "./customization";
import {LoaderCircular} from "../loader";
import useHttp from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import useMessage from "../../hooks/message.hook";
import {Feedback} from "./index";
import Notification from "./notification";

const PersonalArea = () => {
        useIsAuth(true)
        const message = useMessage()
        // имя юзера
        const [user, setUser] = useState(null);
        // флаг первичной загрузки
        const [flag, setFlag] = useState(true);
        //анкеты
        const [forms, setForms] = useState([]);
        // отклики
        const [feedback, setFeedback] = useState([]);
        // уведомления от админа
        const [adminMessage, setAdminMessage] = useState([]);
        const {request, loading} = useHttp()
        const {token, logout, isAdmin, isTeacher} = useContext(AuthContext);
        const history = useHistory()
        const tabsRes = useRef(null);

        /**
         * Получение информации от пользователя
         * @type {(function(): Promise<void>)|*}
         */
        const getPersonalInfo = useCallback(async () => {
            try {
                if (isTeacher) {
                    const getForms = await request('/api/form/personal', 'GET', null, {Authorization: `Bearer ${token}`})
                    setForms(getForms)
                    if (getForms.length) {
                        setUser(getForms[0].teacher.FULL_NAME)
                    } else {
                        const userName = await request('/api/auth/profile', 'GET', null, {Authorization: `Bearer ${token}`})
                        setUser(userName.FULL_NAME)
                    }
                    setFlag(false)
                } else {
                    const userName = await request('/api/auth/profile', 'GET', null, {Authorization: `Bearer ${token}`})
                    setUser(userName.FULL_NAME)
                    setFlag(false)
                }
            } catch (e) {
                if (e.message === 'Текущая сессия закончилась') {
                    setTimeout(() => {
                        logout()
                        history.push('/login')
                    }, 1000)
                }
            }
        }, [logout, history, isTeacher, request, token])

        /**
         * Получание новых откликов каждые 5 секунд
         * @type {(function(): Promise<void>)|*}
         */
        const getFeedback = useCallback(async () => {
                try {
                    if (isTeacher) {
                        const getTeacherFeedback = await request('/api/feedback/teacherFeedback', 'GET', null, {Authorization: `Bearer ${token}`})
                        if (!feedback.length) {
                            setFeedback(getTeacherFeedback)
                        } else if (feedback.length < getTeacherFeedback.length) {
                            message('Пришел новый отклик')
                            let newFeedback = [...getTeacherFeedback]
                            newFeedback.splice(0, feedback.length)
                            const updateFeedback = [...feedback, ...newFeedback]
                            setFeedback(updateFeedback)
                        } else if (feedback.length > getTeacherFeedback.length) {
                            message('Отклик удален')
                            const newId = getTeacherFeedback.map(item => item._id)
                            setFeedback(feedback.filter(item => newId.some(id => id === item._id)))
                        } else if (JSON.stringify(feedback) !== JSON.stringify(getTeacherFeedback)) {
                            let updateTeacherFeedback = feedback.map((item, index) => {
                                for (const key in item) {
                                    if (typeof (item[key]) !== 'object') {
                                        if (item[key] !== getTeacherFeedback[index][key]) {
                                            item = {...item, [key]: getTeacherFeedback[index][key]}
                                        }
                                    }
                                }
                                return item
                            })
                            setFeedback(updateTeacherFeedback)
                        }
                    } else if (!isAdmin) {
                        const getFeedbackFetch = await request('/api/feedback/personal', 'GET', null, {Authorization: `Bearer ${token}`})
                        if (!feedback.length) {
                            setFeedback(getFeedbackFetch)
                        } else if (feedback.length < getFeedbackFetch.length) {
                            let newFeedback = [...getFeedbackFetch]
                            newFeedback.splice(0, feedback.length)
                            const updateFeedback = [...feedback, ...newFeedback]
                            setFeedback(updateFeedback)
                        } else if (feedback.length > getFeedbackFetch.length) {
                            message('Отклик удален')
                            const newId = getFeedbackFetch.map(item => item._id)
                            setFeedback(feedback.filter(item => newId.some(id => id === item._id)))
                        } else if (JSON.stringify(feedback) !== JSON.stringify(getFeedbackFetch)) {
                            message('Новое сообщение')
                            let updateFeedback = feedback.map((item, index) => {
                                for (const key in item) {
                                    if (typeof (item[key]) !== 'object') {
                                        if (item[key] !== getFeedbackFetch[index][key]) {
                                            item = {...item, [key]: getFeedbackFetch[index][key]}
                                        }
                                    }
                                }
                                return item
                            })
                            setFeedback(updateFeedback)
                        }
                    }
                } catch (e) {
                    if (e.message === 'Текущая сессия закончилась') {
                        setTimeout(() => {
                            logout()
                            history.push('/login')
                        }, 1000)
                    }
                }
            }, [logout, history, isTeacher, request, token, isAdmin, feedback, message]
        )

        /**
         * Получение уведомлений от админа
         * @type {(function(): Promise<void>)|*}
         */
        const getAdminMessage = useCallback(async () => {
                try {
                    if (!isAdmin) {
                        const message = await request('/api/admin/userGetAdminMessage', 'GET', null, {Authorization: `Bearer ${token}`})
                        setAdminMessage(message)
                    } else {
                        const message = await request('/api/admin/adminGetAdminMessage', 'GET', null, {Authorization: `Bearer ${token}`})
                        setAdminMessage(message)
                    }
                } catch (e) {
                    if (e.message === 'Текущая сессия закончилась') {
                        setTimeout(() => {
                            logout()
                            history.push('/login')
                        }, 1000)
                    }
                }
            }, []
        )

        useEffect(() => {
            document.title = 'Личный кабинет'
            getPersonalInfo()
            getFeedback()
            getAdminMessage()
        }, [getPersonalInfo]);

        useEffect(() => {
            const intervalGetFeedback = setInterval(() => {
                getFeedback()
            }, 10000)

            return () => {
                clearInterval(intervalGetFeedback)
            };
        }, [getFeedback]);

        /**
         * удаление анкеты
         * @param id id анкеты которую нужно удалить
         * @returns {Promise<void>}
         */
        const deleteForm = async (id) => {
            try {
                const data = await request('/api/form/delete', 'POST', {id}, {Authorization: `Bearer ${token}`})
                message(data.message)
                setForms(forms.filter((form) => form._id !== id))
            } catch (e) {
                logout()
                history.push('/login')
            }
        }

        /**
         * Обновляет state имя пользователя
         * @param newName
         */
        const changeName = (newName) => {
            setUser(newName)
        }

        /**
         * обновление отрицательного ответа в state
         * @param id
         */
        const changeRejection = (id) => {
            let updateTeacherFeedback = feedback.map(item => {
                if (item._id === id) {
                    return {...item, rejection: true}
                }
                return item
            })
            setFeedback(updateTeacherFeedback)
        }

        /**
         * изменение положительно отклика у учителя
         * @param id
         */
        const changeResponse = (id) => {
            let updateTeacherFeedback = feedback.map(item => {
                if (item._id === id) {
                    return {...item, response: true}
                }
                return item
            })
            setFeedback(updateTeacherFeedback)
        }

        /**
         * Классификация пользователя
         * @returns {JSX.Element}
         */
        const rights = () => {
            if (isTeacher) {
                return <h4>Продавец</h4>
            } else if (isAdmin) {
                return <h4>Администратор</h4>
            } else {
                return <h4>Покупатель</h4>
            }
        }

        /**
         * Табы
         * @returns {JSX.Element|null}
         */
        const tabs = () => {
            if (isTeacher) {
                return (
                    <>
                        <li className="tab col s3">
                            <a
                                className="active blue-text"
                                href="#personalProfiles"
                                onClick={() => history.push('/personalArea#personalProfiles')}>
                                Мои анкеты
                            </a>
                        </li>
                        <li className="tab col s3">
                            <a
                                className="active blue-text"
                                href="#personalResponses"
                                onClick={() => history.push('/personalArea#personalResponses')}>
                                Отклики
                            </a>
                        </li>
                    </>
                )
            } else if (isAdmin) {
                return null
            } else {
                return (
                    <li className="tab col s3">
                        <a
                            className="active blue-text"
                            href="#personalResponses"
                            onClick={() => history.push('/personalArea#personalResponses')}>
                            Мои отклики
                        </a>
                    </li>
                )
            }
        }

        /**
         * контент в табах
         * @returns {JSX.Element}
         */
        const contentTabs = () => {
            if (isTeacher) {
                return (
                    <>
                        <div id="personalProfiles" className="col s12">
                            <PersonalProfiles forms={forms} deleteForm={deleteForm}/>
                        </div>
                        <div id="personalResponses" className="col s12">
                            <Feedback feedback={feedback} changeRejection={changeRejection}
                                      changeResponse={changeResponse}/>
                        </div>
                        <div id="notification" className="col s12">
                            <Notification adminMessage={adminMessage} />
                            {/*<Feedback feedback={feedback} changeRejection={changeRejection}*/}
                            {/*          changeResponse={changeResponse}/>*/}
                        </div>
                    </>
                )
            } else if (isAdmin) {
                return (
                    <>
                        <div id="notification" className="col s12">
                            Уведомления от пользователей
                        </div>
                    </>
                )
            } else {
                return (
                    <>
                        <div id="personalResponses" className="col s12">
                            <Feedback feedback={feedback}/>
                        </div>
                        <div id="notification" className="col s12">
                            <Notification adminMessage={adminMessage} />
                        </div>
                    </>
                )
            }
        }

        const render = () => {
            if (loading && flag) {
                return <LoaderCircular/>
            } else {
                if (flag) {
                    M.Tabs.init(tabsRes.current);
                }
                return (
                    <>
                        <h1>{user}</h1>
                        {rights()}
                        <div className="personal__area">
                            <div className="row">
                                <div className="col s12">
                                    <ul ref={tabsRes} className="tabs">
                                        {tabs()}
                                        <li className="tab col s3">
                                            <a
                                                className="blue-text"
                                                href="#notification"
                                                onClick={() => history.push('/personalArea#notification')}>
                                                Уведомления
                                            </a>
                                        </li>
                                        <li className="tab col s3">
                                            <a
                                                className='blue-text'
                                                href="#customization"
                                                onClick={() => history.push('/personalArea#customization')}>
                                                Настройки
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                {contentTabs()}

                                <div id="customization" className="col s12">
                                    <Customization changeName={changeName}/>
                                </div>
                            </div>
                        </div>
                    </>
                );
            }
        }

        return (
            render()
        )
    }
;

export default PersonalArea;
