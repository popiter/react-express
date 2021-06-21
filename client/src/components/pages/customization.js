import React, {useContext, useEffect, useState} from 'react';
import M from 'materialize-css'
import useHttp from "../../hooks/http.hook";
import useMessage from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";
import styled from "styled-components";
import {useHistory} from "react-router-dom";

const Title = styled.h4`
  margin-bottom: 35px;
`

const Customization = ({changeName}) => {
	const {request, clearError, loading, error} = useHttp()
	const {token, logout} = useContext(AuthContext);
	const message = useMessage()
	const history = useHistory()
	const [formPassword, setFormPassword] = useState({
		password: '',
		newPassword: ''
	});
	const [formEmail, setFormEmail] = useState({
		email: '',
		newEmail: ''
	});
	const [newFullName, setNewFullName] = useState('');

	useEffect(() => {
		window.M.updateTextFields()
		const elems = document.querySelectorAll('.modal');
		M.Modal.init(elems);
	}, []);

	useEffect(() => {
		message(error)
		clearError()
	}, [error, message, clearError]);

	const changeHandlerPassword = event => {
		setFormPassword({...formPassword, [event.target.name]: event.target.value})
	}

	const validatePassword = () => {
		if (!formPassword.password) {
			return message('Поле старый пароль является обязательным')
		} else if (!formPassword.newPassword) {
			return message('Поле новый пароль является обязательным')
		} else if (formPassword.newPassword === formPassword.password) {
			return message('Пароли не должны совпадать')
		}
		return true
	}

	const updatePassword = async () => {
		if (validatePassword()) {
			try {
				const data = await request(
					'/api/auth/updatepassword',
					'POST',
					{...formPassword},
					{Authorization: `Bearer ${token}`}
				)
				message(data.message)
				setFormPassword({
					password: '',
					newPassword: ''
				})
			} catch (e) {
				if (e.message === 'Текущая сессия закончилась') {
					setTimeout(() => {
						logout()
					}, 1000)
				}
			}
		}
	}

	const changeHandlerEmail = event => {
		setFormEmail({...formEmail, [event.target.name]: event.target.value})
	}

	const validateEmail = () => {
		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (!formEmail.email) {
			return message('Поле старый Email является обязательным')
		} else if (!formEmail.newEmail) {
			return message('Поле новый Email является обязательным')
		} else if (reg.test(formEmail.newEmail) === false) {
			return message('Email не соответсвует требованиям')
		} else if (formEmail.newEmail === formEmail.email) {
			return message('Email не должен совпадать')
		}
		return true
	}

	const updateEmail = async () => {
		if (validateEmail()) {
			try {
				const data = await request(
					'/api/auth/updateemail',
					'POST',
					{...formEmail},
					{Authorization: `Bearer ${token}`}
				)
				message(data.message)
				setFormEmail({
					email: '',
					newEmail: ''
				})
			} catch (e) {
				if (e.message === 'Текущая сессия закончилась') {
					setTimeout(() => {
						logout()
					}, 1000)
				}
			}
		}
	}

	const changeHandlerFullName = event => {
		setNewFullName(event.target.value)
	}

	const updateFullName = async () => {
		try {
			const data = await request(
				'/api/auth/updatefullname',
				'POST',
				{newFullName},
				{Authorization: `Bearer ${token}`}
			)
			message(data.message)
			changeName(newFullName)
			setNewFullName('')
		} catch (e) {
			if (e.message === 'Текущая сессия закончилась') {
				setTimeout(() => {
					logout()
				}, 1000)
			}
		}
	}

	const deleteAccount = async () => {
		try {
			const data = await request('/api/auth/deleteAccount', 'POST', {}, {Authorization: `Bearer ${token}`})
			message(data.message)
			setTimeout(() => {
				logout()
				history.push('/register')
			}, 2000)
		} catch (e) {
			logout()
			history.push('/login')
		}
	}

	return (
		<>
			<div className="row">
				<div className='col s12'>
					<Title>Обновление пароля</Title>
					<div className="input-field ">
						<input
							placeholder='Введите свой пароль'
							id="password"
							type="password"
							name='password'
							className="validate"
							value={formPassword.password}
							onChange={changeHandlerPassword}
						/>
						<label htmlFor="password">Пароль</label>
					</div>
				</div>

				<div className='col s12'>
					<div className="input-field ">
						<input
							placeholder='Введите свой новый пароль'
							id="newPassword"
							type="password"
							name='newPassword'
							className="validate"
							value={formPassword.newPassword}
							onChange={changeHandlerPassword}
						/>
						<label htmlFor="newPassword">Пароль</label>
					</div>
					<button className='white-text btn blue darken-1' onClick={updatePassword}
					        disabled={loading}>Изменить пароль
					</button>
				</div>

				<div className='col s12'>
					<Title>Обновление Email</Title>
					<div className="input-field ">
						<input
							placeholder='Введите свой Email'
							id="email"
							type="email"
							name='email'
							className="validate"
							value={formEmail.email}
							onChange={changeHandlerEmail}
						/>
						<label htmlFor="email">Email</label>
					</div>
				</div>

				<div className='col s12'>
					<div className="input-field ">
						<input
							placeholder='Введите свой новый Email'
							id="newEmail"
							type="email"
							name='newEmail'
							className="validate"
							value={formEmail.newEmail}
							onChange={changeHandlerEmail}
						/>
						<label htmlFor="newEmail">Email</label>
					</div>
					<button className='white-text btn blue darken-1' onClick={updateEmail} disabled={loading}>Изменить
						Email
					</button>
				</div>

				<div className='col s12'>
					<Title>Обновление ФИО</Title>
					<div className="input-field ">
						<input
							placeholder='Введите свои новые ФИО'
							id="newFullName"
							type="text"
							name='newFullName'
							className="validate"
							value={newFullName}
							onChange={changeHandlerFullName}
						/>
						<label htmlFor="newFullName">ФИО</label>
					</div>
					<button
						className='white-text btn blue darken-1'
						onClick={updateFullName}
						disabled={loading}
					>
						Изменить ФИО
					</button>
				</div>
				<div className='col s12'>
					<button data-target="confirmation" className="btn red white-text modal-trigger margin-top-custom">Удалить аккаунт</button>
				</div>
			</div>

			<div id="confirmation" className="modal">
				<div className="modal-content">
					<h4>Вы действительно хотите удалить свой аккаунт?</h4>
					<h5>Все данные будут потеряны!</h5>
				</div>
				<div className="modal-footer">
					<button
						className={`modal-close btn red white-text btn-flat`}
						onClick={deleteAccount}
					>
						Удалить
					</button>
				</div>
			</div>
		</>
	);
};

export default Customization;
