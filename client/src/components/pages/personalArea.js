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
	const {request, loading} = useHttp()
	const {token, logout, isAdmin, isTeacher} = useContext(AuthContext);
	const history = useHistory()
	const tabsRes = useRef(null);

	const getPersonalInfo = useCallback(async () => {
		try {
			if (isTeacher) {
				const data = await request('/api/form/personal', 'GET', null, {Authorization: `Bearer ${token}`})
				const data2 = await request('/api/feedback/teacherFeedback', 'GET', null, {Authorization: `Bearer ${token}`})
				console.log(data2)
				setForms(data)
				if (data.length) {
					setUser(data[0].teacher.FULL_NAME)
				} else {
					const userName = await request('/api/auth/profile', 'GET', null, {Authorization: `Bearer ${token}`})
					setUser(userName.FULL_NAME)
				}
				setFlag(false)
			} else {
				if (!isAdmin) {
					const getFeedback = await request('/api/feedback/personal', 'GET', null, {Authorization: `Bearer ${token}`})
					setFeedback(getFeedback)
				}
				const userName = await request('/api/auth/profile', 'GET', null, {Authorization: `Bearer ${token}`})
				setUser(userName.FULL_NAME)
			}
		} catch (e) {
			logout()
			history.push('/login')
		}
	}, [logout, history, isTeacher, request, token, isAdmin])

	useEffect(() => {
		getPersonalInfo()
	}, [getPersonalInfo]);

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

	const changeName = (newName) => {
		setUser(newName)
	}

	const rights = () => {
		if (isTeacher) {
			return <h4>Преподаватель</h4>
		} else if (isAdmin) {
			return <h4>Администратор</h4>
		} else {
			return <h4>Студент</h4>
		}
	}

	const tabs = () => {
		if (isTeacher) {
			return (
				<li className="tab col s3">
					<a
						className="active blue-text"
						href="#personalProfiles"
						onClick={() => history.push('/personalArea#personalProfiles')}>
						Мои анкеты
					</a>
				</li>
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

	const contentTabs = () => {
		if (isTeacher) {
			return (
				<>
					<div id="personalProfiles" className="col s12">
						<PersonalProfiles forms={forms} deleteForm={deleteForm}/>
					</div>
					<div id="notification" className="col s12">
						Уведомления об откликах
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
						Уведомления о решениях
					</div>
				</>
			)
		}
	}

	const render = () => {
		if (loading && flag) {
			return <LoaderCircular/>
		} else {
			M.Tabs.init(tabsRes.current);
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
};

export default PersonalArea;
