import React from "react"
import {NavLink} from "react-router-dom";

const Error =() => {
	return (
		<div className='container'>
			<h1>Произошла какая-то ошибка</h1>
			<NavLink to='/questionnaires'>Вернуться на главную страницу</NavLink>
		</div>
	)
}

export default Error