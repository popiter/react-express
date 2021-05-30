import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {AuthContext} from "../../context/AuthContext";
import useMessage from "../../hooks/message.hook";
import useHttp from "../../hooks/http.hook";
import M from "materialize-css";
import useAuth from "../../hooks/auth.hook";
import {useHistory} from "react-router-dom";

const Card = styled.div`
  padding-top: 30px;
  margin-bottom: 150px;

  .card__header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 50px;
  }

  .full__name {
    font-size: 45px;
    margin: 0 30px 0 0 !important;

    @media (max-width: 500px) {
      font-size: 30px;
    }
  }

  .card__img {
    width: 200px;
    height: 200px;
    border-radius: 5%;
    margin-right: 30px;

    @media (max-width: 500px) {
      width: 150px;
      height: 150px;
    }
  }

  .line {
    background-color: #1E88E5;
    width: 3px;
    height: 200px;
    margin-right: 30px;
  }

  .btn-custom {
    margin-top: 50px;
    float: right;
  }
`

const QuestionnaireDetails = ({form}) => {
	const {isAuthenticated, isTeacher, isAdmin, token} = useContext(AuthContext);
	const message = useMessage()
	const {error, clearError, request} = useHttp()
	const {logout} = useAuth()
	const history = useHistory()
	const formMessage = 'Меня заинтересовала ваша анкета! Пожалуйста позвоните'
	const [postForm, setForm] = useState({
		transmittalLetter: '',
		userPhone: ''
	});

	const toCurrency = price => {
		return new Intl.NumberFormat('ru-RU', {
			currency: 'rub',
			style: 'currency'
		}).format(price)
	}

	useEffect(() => {
		window.M.updateTextFields()
		const modal = document.querySelectorAll('.modal');
		M.Modal.init(modal);
	}, []);

	useEffect(() => {
		message(error)
		clearError()
	}, [error, message, clearError]);

	const toDate = date => {
		return new Intl.DateTimeFormat('ru-RU', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(new Date(date))
	}

	const changeHandler = event => {
		setForm({...postForm, [event.target.name]: event.target.value})
	}

	const createFeedback = async () => {
		try {
			const data = await request('/api/feedback/create', 'POST', {
				...postForm,
				form: form._id
			}, {Authorization: `Bearer ${token}`})
			message(data.message)
			setTimeout(() => {
				history.push('/questionnaires')
			}, 500)
			setForm({
				test: '',
				phone: ''
			})
		} catch (e) {
			if (e.message === 'Текущая сессия закончилась') {
				setTimeout(() => {
					logout()
					history.push('/login')
				}, 1000)
			}
		}
	}

	return (
		<>
			<Card>
				<div className='card__header'>
					<img className='card__img' src={form.img} alt={form.teacher.FULL_NAME}/>
					<h1 className='full__name'>
						{form.teacher.FULL_NAME.split(' ').map((el, index) => {
							return (
								<span key={index}>
								{el}
									<br/>
							</span>
							)
						})}
					</h1>
					<span className="line"/>
					<div className="card__info">
						<h4>Дата публикации: {toDate(form.date)}</h4>
						<h4>Предмет: {form.subjects}</h4>
						<h4>Цена: {toCurrency(form.price)}</h4>
					</div>
				</div>
				<div className="card__footer">
					<h5>{form.aboutMe}</h5>
					{!isAuthenticated
					|| isTeacher
					|| isAdmin ? null :
						<button
							data-target="feedback"
							className='btn-custom modal-trigger btn white-text blue darken-1 btn-large'>
							Откликнуться
						</button>}
				</div>
			</Card>
			<div id="feedback" className="modal">
				<div className="modal-content">
					<h4 style={{marginBottom: '30px'}}>Отклик на анкету</h4>
					<div className="input-field">
						<input
							placeholder="Введите телефон формата +7 (***)-***-**-**"
							id="userPhone"
							type="tel"
							name='userPhone'
							className='blue-textarea black-text'
							value={postForm.userPhone}
							onChange={changeHandler}
						/>
						<label htmlFor="userPhone">Телефон</label>
					</div>
					<div className="input-field">
						<textarea
							id="transmittalLetter"
							className="materialize-textarea blue-textarea black-text"
							name='transmittalLetter'
							onChange={changeHandler}
							placeholder='Введите сообщение для преподавателя'
							value={postForm.transmittalLetter}
						/>
						<label htmlFor="transmittalLetter">Сопроводительное письмо</label>
						<button
							onClick={() => {
								setForm({...postForm, transmittalLetter: formMessage})
								const elems = document.getElementById('transmittalLetter');
								M.textareaAutoResize(elems)
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
						onClick={createFeedback}
					>
						Откликнуться
					</button>
				</div>
			</div>
		</>
	)
}

export default QuestionnaireDetails
