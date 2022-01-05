import React, {useContext, useEffect} from 'react';
import M from 'materialize-css/dist/js/materialize.min'
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import styled from "styled-components";

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 500;
`

const NavBar = () => {
	const {isAuthenticated, isTeacher, logout, isAdmin} = useContext(AuthContext)

	useEffect(() => {
		const elems = document.querySelectorAll('.sidenav');
		M.Sidenav.init(elems);
	}, []);

	/**
	 * Выход
	 */
	const logoutHandler = () => {
		logout()
	}

	/**
	 * Определение ссылок для конкретных пользователей
	 * @returns {JSX.Element}
	 */
	const role = () => {
		if (isAuthenticated) {
			if (isTeacher) {
				return (
					<>
						<li><NavLink to='/createApplication'>Создание анкеты</NavLink></li>
						<li><NavLink to='/personalArea#customization'>Личный кабинет</NavLink></li>
						<li><NavLink to='/' onClick={logoutHandler}>Выйти</NavLink></li>
					</>
				)
			} else if (isAdmin) {
				return (
					<>
						<li><NavLink to='/allUsers'>Все пользователи</NavLink></li>
						<li><NavLink to='/personalArea#customization'>Личный кабинет</NavLink></li>
						<li><NavLink to='/' onClick={logoutHandler}>Выйти</NavLink></li>
					</>
				)
			} else {
				return (
					<>
						<li><NavLink to='/personalArea#customization'>Личный кабинет</NavLink></li>
						<li><NavLink to='/' onClick={logoutHandler}>Выйти</NavLink></li>
					</>
				)
			}
		} else {
			return (
				<>
					<li><NavLink to='/login'>Авторизация</NavLink></li>
					<li><NavLink to='/register'>Регистрация</NavLink></li>
				</>
			)
		}
	}

	return (
		<header>
			<Nav>
				<div className="nav-wrapper blue darken-1">
					<NavLink to='/' className='brand-logo'>Репетиторство</NavLink>
					<a data-target="mobile-demo" className="sidenav-trigger">
						<i className="material-icons cursor-pointer">menu</i>
					</a>
					<ul id="nav-mobile" className="right hide-on-med-and-down">
						<li><NavLink to='/questionnaires'>Анкеты</NavLink></li>
						{role()}
					</ul>
				</div>
			</Nav>

			<ul className="sidenav" id="mobile-demo">
				<li><NavLink to='/questionnaires'>Анкеты</NavLink></li>
				{role()}
			</ul>
		</header>

	);
};

export default NavBar;
