import React, {useContext, useEffect, useState} from 'react';
import useHttp from "../../hooks/http.hook";
import styled from "styled-components";
import useMessage from "../../hooks/message.hook";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

const Button = styled.button`
  color: #000;
  display: flex;
  margin: 0 auto;
`

const AuthRegister = () => {
	const history = useHistory()
	const auth = useContext(AuthContext);
	const message = useMessage()
	const {loading, error, request, clearError} = useHttp()
	const [form, setForm] = useState({
		FULL_NAME: '',
		email: '',
		password: ''
	});

	useEffect(() => {
		message(error)
		clearError()
	}, [error, message, clearError]);

	useEffect(() => {
		document.title = 'Регистрация'
		window.M.updateTextFields()
	}, []);

	const [isTeacher, setIsTeacher] = useState(false);

	/**
	 * Изменение полей в State
	 * @param event
	 */
	const changeHandler = event => {
		setForm({...form, [event.target.name]: event.target.value})
	}

	/**
	 * Регистрация пользователя
	 * @returns {Promise<void>}
	 */
	const registerHandler = async () => {
		try {
			const reg = await request('/api/auth/register', 'POST', {...form, isTeacher})
			message(reg.message)
			const log = await request('/api/auth/login', 'POST', {...form})
			auth.login(log.token, log.userId, log.isTeacher, log.isAdmin)
			history.push('/personalArea#customization')
			// setTimeout(() => {
			// 	history.push('/login')
			// }, 2000)
		} catch (e) {
		}
	}

	return (
		<div className="row" style={{paddingTop: '30px'}}>
			<div className="col m12 s12 xl6 offset-xl3">
				<div className="card blue darken-1">
					<div className="card-content white-text">
						<span className="card-title">Регистрация</span>
						<div>
							<div className="input-field">
								<input
									placeholder="Введите ФИО"
									id="FULL_NAME"
									type="text"
									name='FULL_NAME'
									className='white-input white-text'
									value={form.FULL_NAME}
									onChange={changeHandler}
								/>
								<label htmlFor="FULL_NAME">ФИО</label>
							</div>
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
							<div className="input-field">
								<p>
									<label>
										<input
											type="checkbox"
											className="checkbox-white"
											defaultChecked={isTeacher}
											name='isTeacher'
											onChange={() => setIsTeacher(!isTeacher)}
										/>
										<span className='white-text'>Вы преподователь?</span>
									</label>
								</p>
							</div>
						</div>
					</div>
					<div className="card-action">
						<Button
							className="btn white"
							onClick={registerHandler}
							disabled={loading}
						>
							Зарегистрироваться
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthRegister;
