import React, {useContext, useEffect, useState} from 'react';
import M from 'materialize-css'
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {AuthContext} from "../../context/AuthContext";
import useHttp from "../../hooks/http.hook";
import useMessage from "../../hooks/message.hook";

const ButtonOpen = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
`

const ButtonFeedback = styled.button`
  position: absolute;
  right: 120px;
  bottom: 10px;
`

const ButtonFailure = styled.button`
  position: absolute;
  right: 275px;
  bottom: 10px;
`

const Feedback = ({feedback, changeRejection, changeResponse}) => {
	const {request} = useHttp()
	const {isTeacher, logout, token} = useContext(AuthContext);
	const message = useMessage()
	const history = useHistory()
	const formMessage = 'Обратная связь будет дана в ближайшие время'
	const [postFeedBack, setPostFeedBack] = useState({
		teacherPhone: '',
		answer: '',
		response: true
	});
	const [currentFeedbackId, setCurrentFeedbackId] = useState('');
	useEffect(() => {
		window.M.updateTextFields()
		M.Modal.init(document.querySelectorAll('.modal'));
	}, []);

	const toDate = date => {
		return new Intl.DateTimeFormat('ru-RU', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(new Date(date))
	}

	const toCurrency = price => {
		return new Intl.NumberFormat('ru-RU', {
			currency: 'rub',
			style: 'currency'
		}).format(price)
	}

	const checkRes = (response, rejection) => {
		if (response) {
			return (
				<span className="secondary-content green-text">
					<i className="material-icons">
						done
					</i>
				</span>
			)
		} else if (rejection) {
			return (
				<span className="secondary-content red-text">
					<i className="material-icons">
						clear
					</i>
				</span>
			)
		} else {
			return (
				<span className="secondary-content grey-text">
					<i className="material-icons">
						send
					</i>
				</span>
			)
		}
	}

	const rejectionTeacher = async (id) => {
		try {
			const data = await request(
				'/api/feedback/rejectionTeacher',
				'POST',
				{id},
				{Authorization: `Bearer ${token}`}
			)
			changeRejection(id)
			message(data.message)
		} catch (e) {
			if (e.message === 'Текущая сессия закончилась') {
				setTimeout(() => {
					logout()
				}, 1000)
			}
		}
	}

	const changeHandler = (event) => {
		setPostFeedBack({...postFeedBack, [event.target.name]: event.target.value})
	}

	const responseTeacher = async (id) => {
		try {
			const data = await request(
				'/api/feedback/responseTeacher',
				'POST',
				{id, ...postFeedBack},
				{Authorization: `Bearer ${token}`}
			)
			changeResponse(id)
			message(data.message)
		} catch (e) {
			if (e.message === 'Текущая сессия закончилась') {
				setTimeout(() => {
					logout()
				}, 1000)
			}
		}
	}

	const renderFeedback = () => {
		return (
			<ul className='collection'>
				{feedback.map(feed => {
					return (
						<li
							key={feed._id}
							className="collection-item avatar"
						>
							<div className='margin-bottom-custom'>
								<img src={feed.form.img} alt={feed.form.teacher.FULL_NAME} className="circle"/>
								<span className="title">
									{feed.form.teacher.FULL_NAME} <br/>
									{feed.form.subjects}
									{` ${toCurrency(feed.form.price)}`}
								</span>
								<p className='padding-top-custom'>
									{!isTeacher ? 'Вы: ' : `${feed.user.FULL_NAME}: `}
									{feed.transmittalLetter}
									<a href={`tel:+7${feed.userPhone}`}>
										{` 8${feed.userPhone}`}
									</a> <br/>
									{toDate(feed.date)} <br/>
									{feed.answer.length ? `${feed.form.teacher.FULL_NAME}: ${feed.answer}` : null}
									{feed.teacherPhone ?
										<a href={`tel:+7${feed.teacherPhone}`}>
											{` 8${feed.teacherPhone}`}
										</a> : null}
								</p>
								{checkRes(feed.response, feed.rejection)}
							</div>
							<ButtonOpen
								className='btn blue'
								onClick={() => history.push(`/questionnairesDetail/${feed.form._id}`)}
							>
								Открыть
							</ButtonOpen>

							{isTeacher && !feed.rejection && !feed.response ?
								<ButtonFeedback
									data-target="feedback"
									className='btn blue modal-trigger'
									onClick={() => setCurrentFeedbackId(feed._id)}
								>
									Откликнуться
								</ButtonFeedback>
								: null}

							{isTeacher && !feed.rejection && !feed.response ?
								<ButtonFailure
									className='btn red'
									onClick={() => rejectionTeacher(feed._id)}
								>
									Отклонить
								</ButtonFailure>
								: null}
						</li>
					)
				})}
			</ul>
		)
	}

	return (
		<>
			<div className='row margin-top-custom'>
				{!feedback.length ? <h5>У вас нет откликов</h5> : renderFeedback()}
			</div>

			<div id="feedback" className="modal">
				<div className="modal-content">
					<h4 style={{marginBottom: '30px'}}>Ответ на отклик</h4>
					<div className="input-field">
						<input
							placeholder="Введите телефон формата +7 (***)-***-**-**"
							id="teacherPhone"
							type="tel"
							name='teacherPhone'
							className='blue-textarea black-text'
							value={postFeedBack.teacherPhone}
							onChange={changeHandler}
						/>
						<label htmlFor="teacherPhone">Телефон</label>
					</div>
					<div className="input-field">
						<textarea
							id="answer"
							className="materialize-textarea blue-textarea black-text"
							name='answer'
							onChange={changeHandler}
							placeholder='Введите сообщение для преподавателя'
							value={postFeedBack.answer}
						/>
						<label htmlFor="answer">Сопроводительное письмо</label>
						<button
							onClick={() => {
								setPostFeedBack({...postFeedBack, answer: formMessage})
								M.textareaAutoResize(document.getElementById('answer'))
							}}
							className='btn blue white-text'
						>
							Вставить текст письма
						</button>
					</div>
				</div>

				<div className="modal-footer">
					<button
						className={`modal-close btn blue white-text btn-flat`}
						onClick={() => responseTeacher(currentFeedbackId)}
					>
						Отправить
					</button>
				</div>
			</div>
		</>
	)
};

export default Feedback;
