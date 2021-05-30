import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import useHttp from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import useMessage from "../../hooks/message.hook";
import {useHistory} from "react-router-dom";
import useIsAuth from "../../hooks/isAuth.hook";

const Button = styled.button`
  color: #000;
  display: flex;
  margin: 0 auto;
`

const Img = styled.img`
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 5%;
  margin-bottom: 20px;

  @media (max-width: 500px) {
    width: 150px;
    height: 150px;
  }
`

const TextPhoto = styled.p`
  margin-bottom: 10px !important;
`

const CreateApplication = () => {
	useIsAuth(true)
	const history = useHistory()
	const auth = useContext(AuthContext)
	const message = useMessage()
	const {request, error, clearError, loading} = useHttp()
	const [form, setForm] = useState({
		price: 500,
		subjects: '',
		aboutMe: ''
	});
	const [img, setImg] = useState('');

	const changeHandler = event => {
		setForm({...form, [event.target.name]: event.target.value})
	}

	useEffect(() => {
		window.M.updateTextFields()
	}, []);

	useEffect(() => {
		message(error)
		clearError()
	}, [error, message, clearError]);

	const uploadImage = async (e) => {
		const file = e.target.files[0]
		const base64 = await convertBase64(file)
		setImg(base64)
	}

	const convertBase64 = file => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader()
			fileReader.readAsDataURL(file)

			fileReader.onload = () => {
				resolve(fileReader.result)
			}

			fileReader.onerror = error => {
				reject(error)
			}
		})
	}

	const validate = () => {
		if (!img) {
			return message('Фото явлется обязательным полем')
		} else if (!form.subjects) {
			return message('Предмет явлется обязательным полем')
		} else if (!form.aboutMe) {
			return message('Обязательно расскажите о себе')
		}
		return true
	}

	const sendForm = async () => {
		if (validate()) {
			try {
				const data = await request(
					'/api/form/create',
					'POST',
					{...form, img},
					{Authorization: `Bearer ${auth.token}`})
				message(data.message)
				setTimeout(() => {
					history.push('/personalArea#personalProfiles')
				}, 1000)
			} catch (e) {
				if (e.message === 'Текущая сессия закончилась') {
					setTimeout(() => {
						auth.logout()
						history.push('/login')
					}, 1000)
				}
			}
		}
	}

	return (
		<div className='row' style={{paddingTop: '20px'}}>
			<div className="col m12 s12 xl6 offset-xl3">
				<div className="card blue darken-1">
					<div className="card-content white-text">
						<span className="card-title">Создание анкеты</span>
						<div className="input-field">
							<input
								placeholder="Введите цену"
								id="price"
								type="number"
								name='price'
								className='white-input white-text'
								value={form.price}
								onChange={changeHandler}
							/>
							<label htmlFor="price">Цена</label>
						</div>
						<div className="file-field input-field">
							<TextPhoto>Пример вашей фотографии</TextPhoto>
							<Img src={!img ? process.env.PUBLIC_URL + '/assets/img/user-photo.png' : img}/>
							<div className="btn white" style={{color: "black"}}>
								<span>Фото</span>
								<input
									type="file"
									name='img'
									onChange={(e) => {
										uploadImage(e)
									}}
								/>
							</div>
							<div className="file-path-wrapper">
								<input
									className="file-path validate white-input white-text"
									type="text"
									placeholder="Загрузите фото"
								/>
							</div>
						</div>
						<div className="input-field">
							<input
								placeholder="Введите предметы через запятую"
								id="subjects"
								type="text"
								name='subjects'
								className='white-input white-text'
								value={form.subjects}
								onChange={changeHandler}
							/>
							<label htmlFor="subjects">Предмет</label>
						</div>
						<div className="input-field">
							<textarea
								id="aboutMe"
								className="materialize-textarea white-textarea white-text"
								name='aboutMe'
								onChange={changeHandler}
								placeholder='Расскажите о себе'
								value={form.aboutMe}
							/>
							<label htmlFor="aboutMe">О себе</label>
						</div>
					</div>
					<div className="card-action">
						<Button
							className="btn white"
							onClick={sendForm}
							disabled={loading}
						>
							Создать анкету
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateApplication;
