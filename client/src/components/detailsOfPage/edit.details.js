import React, {useContext, useEffect, useState} from 'react';
import M from 'materialize-css'
import styled from "styled-components";
import useHttp from "../../hooks/http.hook";
import useMessage from "../../hooks/message.hook";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

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

const EditDetails = ({form}) => {
	const message = useMessage()
	const history = useHistory()
	const {logout, token} = useContext(AuthContext);
	const [currentForm, setForm] = useState({
		price: +form.price,
		subjects: form.subjects,
		aboutMe: form.aboutMe
	});
	const [img, setImg] = useState(form.img);

	const {request, loading} = useHttp()

	useEffect(() => {
		M.updateTextFields()
		const elems = document.getElementById('aboutMe');
		M.textareaAutoResize(elems)
	}, []);

	/**
	 * Измение полей в state
	 * @param event
	 */
	const changeHandler = event => {
		setForm({...currentForm, [event.target.name]: event.target.value})
	}

	/**
	 * Сохранение фото в base64 в state
	 * @param e
	 * @returns {Promise<void>}
	 */
	const uploadImage = async (e) => {
		const file = e.target.files[0]
		const base64 = await convertBase64(file)
		setImg(base64)
	}

	/**
	 * конвертация фото в base64
	 * @param file
	 * @returns {Promise<unknown>}
	 */
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

	/**
	 * Валидация полей перед отправкой анкеты
	 * @returns {boolean|void|*}
	 */
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

	/**
	 * Валадация на совпадение полей с уже опубликованной анкеты
	 * @returns {boolean|void|*}
	 */
	const coincidences = () => {
		if (+currentForm.price !== form.price
			|| currentForm.subjects !== form.subjects
			|| currentForm.aboutMe !== form.aboutMe
			|| img !== form.img
		) {
			return true
		}
		return message('Все поля совпадают с текущей опубликованной анкетой')
	}

	/**
	 * отправка обновленной анкетой
	 * @returns {Promise<void>}
	 */
	const sendForm = async () => {
		if (validate() && coincidences()) {
			try {
				const data = await request(
					'/api/form/editForm',
					'POST',
					{...currentForm, img, id: form._id},
					{Authorization: `Bearer ${token}`})
				message(data.message)
				setTimeout(() => {
					history.push(`/questionnairesDetail/${form._id}`)
				}, 500)
			} catch (e) {
				if (e.message === 'Текущая сессия закончилась') {
					setTimeout(() => {
						logout()
						history.push('/login')
					}, 500)
				}
			}
		}
	}

	return (
		<div className='row' style={{paddingTop: '20px'}}>
			<div className="col m12 s12 xl6 offset-xl3">
				<div className="card blue darken-1">
					<div className="card-content white-text">
						<span className="card-title">Редактирование анкеты</span>
						<div className="input-field">
							<input
								placeholder="Введите цену"
								id="price"
								type="number"
								name='price'
								className='white-input white-text'
								value={currentForm.price}
								onChange={changeHandler}
							/>
							<label htmlFor="price">Цена</label>
						</div>
						<div className="file-field input-field">
							<TextPhoto>Ваша фотография</TextPhoto>
							<Img src={img}/>
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
								value={currentForm.subjects}
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
								value={currentForm.aboutMe}
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
							Изменить
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditDetails;
