import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import useHttp from "../../hooks/http.hook";
import useMessage from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";
import {useHistory} from 'react-router-dom'

const Button = styled.button`
  color: #000;
  display: flex;
  margin: 0 auto;
`

const AuthLogin = () => {
	const history = useHistory()
	const auth = useContext(AuthContext);
	const message = useMessage()
	const {loading, error, request, clearError} = useHttp()
	const [form, setForm] = useState({
		email: '', password: ''
	});

	useEffect(() => {
		message(error)
		clearError()
	}, [error, message, clearError]);

	useEffect(() => {
		document.title = 'Авторизация'
		window.M.updateTextFields()
	}, []);

	/**
	 * изменение полей в state
	 * @param event
	 */
	const changeHandler = event => {
		setForm({...form, [event.target.name]: event.target.value})
	}

	/**
	 * Авторизация пользователя
	 * @returns {Promise<void>}
	 */
	const loginHandler = async () => {
		try {
			const data = await request('/api/auth/login', 'POST', {...form})
			auth.login(data.token, data.userId, data.isTeacher, data.isAdmin)
			history.push('/personalArea#customization')
		} catch (e) {}
	}

	return (
		<div className="row" style={{paddingTop: '30px'}}>
			<div className="col m12 s12 xl6 offset-xl3">
				<div className="card blue darken-1">
					<div className="card-content white-text">
						<span className="card-title">Авторизация</span>
						<div>
							<div className="input-field">
								<input
									placeholder="Введите email"
									id="email"
									type="email"
									name='email'
									className='white-input white-text'
									value={form.email}
									onChange={changeHandler}
								/>
								<label htmlFor="email">Email</label>
							</div>
							<div className="input-field">
								<input
									placeholder="Введите пароль"
									id="password"
									type="password"
									name='password'
									className='white-input white-text'
									value={form.password}
									onChange={changeHandler}
								/>
								<label htmlFor="password">Пароль</label>
							</div>
						</div>
					</div>
					<div className="card-action">
						<Button
							className="btn white"
							onClick={loginHandler}
							disabled={loading}
						>
							Войти
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthLogin;
