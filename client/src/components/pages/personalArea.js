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
		//отклики на анкеты для учителя
		const [teacherFeedback, setTeacherFeedback] = useState([]);
		const {request, loading} = useHttp()
		const {token, logout, isAdmin, isTeacher} = useContext(AuthContext);
		const history = useHistory()
		const tabsRes = useRef(null);

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

		const getFeedback = useCallback(async () => {
				try {
					if (isTeacher) {
						const getTeacherFeedback = await request('/api/feedback/teacherFeedback', 'GET', null, {Authorization: `Bearer ${token}`})
						console.log(1)
						if (!teacherFeedback.length) {
							setTeacherFeedback(getTeacherFeedback)
							console.log(2)
						} else if (teacherFeedback.length < getTeacherFeedback.length) {
							console.log(3)
							message('Пришел новый отклик')
							let newFeedback = [...getTeacherFeedback]
							newFeedback.splice(0, teacherFeedback.length)
							const updateFeedback = [...teacherFeedback, ...newFeedback]
							setTeacherFeedback(updateFeedback)
						} else if (teacherFeedback.length > getTeacherFeedback.length) {
							console.log(4)
							message('Отклик удален')
							const newId = getTeacherFeedback.map(item => item._id)
							setTeacherFeedback(teacherFeedback.filter(item => newId.some(id => id === item._id)))
						} else if (JSON.stringify(teacherFeedback) !== JSON.stringify(getTeacherFeedback)) {
							let updateTeacherFeedback = teacherFeedback.map((item, index) => {
								for (const key in item) {
									if (typeof (item[key]) !== 'object') {
										if (item[key] !== getTeacherFeedback[index][key]) {
											item = {...item, [key]: getTeacherFeedback[index][key]}
										}
									}
								}
								return item
							})
							setTeacherFeedback(updateTeacherFeedback)
						}
					} else {
						if (!isAdmin) {
							const getFeedbackFetch = await request('/api/feedback/personal', 'GET', null, {Authorization: `Bearer ${token}`})
							console.log(1)
							if (!feedback.length) {
								console.log(2)
								setFeedback(getFeedbackFetch)
							} else if (feedback.length < getFeedbackFetch.length) {
								console.log(3)
								let newFeedback = [...getFeedbackFetch]
								newFeedback.splice(0, feedback.length)
								const updateFeedback = [...feedback, ...newFeedback]
								setFeedback(updateFeedback)
							} else if (feedback.length > getFeedbackFetch.length) {
								console.log(4)
								message('Отклик удален')
								const newId = getFeedbackFetch.map(item => item._id)
								setFeedback(feedback.filter(item => newId.some(id => id === item._id)))
							} else if (JSON.stringify(feedback) !== JSON.stringify(getFeedbackFetch)) {
								console.log(5)
								let updateFeedback = feedback.map((item, index) => {
									// if (item.response !== getFeedbackFetch[index].response) {
									// 	item = {...item, response: getFeedbackFetch[index].response}
									// }
									// if (item.rejection !== getFeedbackFetch[index].rejection) {
									// 	item = {...item, rejection: getFeedbackFetch[index].rejection}
									// }
									// if (item.teacherPhone !== getFeedbackFetch[index].teacherPhone) {
									// 	item = {...item, teacherPhone: getFeedbackFetch[index].teacherPhone}
									// }
									// if (item.answer !== getFeedbackFetch[index].answer) {
									// 	item = {...item, answer: getFeedbackFetch[index].answer}
									// }

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
					}
				} catch
					(e) {
					if (e.message === 'Текущая сессия закончилась') {
						setTimeout(() => {
							logout()
							history.push('/login')
						}, 1000)
					}
				}
			}, [logout, history, isTeacher, request, token, isAdmin, feedback, teacherFeedback, message]
		)

		useEffect(() => {
			getPersonalInfo()
		}, [getPersonalInfo]);

		useEffect(() => {
			getFeedback()
			const intervalGetFeedback = setInterval(() => {
				getFeedback()
			}, 2000)

			return () => clearInterval(intervalGetFeedback)
		}, [getFeedback])

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

		const changeRejection = (id) => {
			let updateTeacherFeedback = teacherFeedback.map(item => {
				if (item._id === id) {
					return {...item, rejection: true}
				}
				return item
			})
			setTeacherFeedback(updateTeacherFeedback)
		}

		const changeResponse = (id) => {
			let updateTeacherFeedback = teacherFeedback.map(item => {
				if (item._id === id) {
					return {...item, response: true}
				}
				return item
			})
			setTeacherFeedback(updateTeacherFeedback)
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
							<Feedback feedback={teacherFeedback} changeRejection={changeRejection}
							          changeResponse={changeResponse}/>
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
							Уведомления
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
