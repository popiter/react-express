import React, {useContext, useEffect, useRef} from 'react';
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
    const sideBarRef = useRef(null);

    useEffect(() => {
        M.Sidenav.init(sideBarRef.current)
    }, []);

    /**
     * Выход
     */
    const logoutHandler = () => {
        logout()
    }

    const closeSidebar = () => {
        const instance = M.Sidenav.getInstance(sideBarRef.current);
        instance.close()
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
                        <li onClick={closeSidebar}><NavLink to='/createApplication'>Создание анкеты</NavLink></li>
                        <li onClick={closeSidebar}><NavLink to='/personalArea#customization'>Личный кабинет</NavLink>
                        </li>
                        <li onClick={closeSidebar}><NavLink to='/' onClick={logoutHandler}>Выйти</NavLink></li>
                    </>
                )
            } else if (isAdmin) {
                return (
                    <>
                        <li onClick={closeSidebar}><NavLink to='/allUsers'>Все пользователи</NavLink></li>
                        <li onClick={closeSidebar}><NavLink to='/personalArea#customization'>Личный кабинет</NavLink>
                        </li>
                        <li onClick={closeSidebar}><NavLink to='/' onClick={logoutHandler}>Выйти</NavLink></li>
                    </>
                )
            } else {
                return (
                    <>
                        <li onClick={closeSidebar}><NavLink to='/personalArea#customization'>Личный кабинет</NavLink>
                        </li>
                        <li onClick={closeSidebar}><NavLink to='/' onClick={logoutHandler}>Выйти</NavLink></li>
                    </>
                )
            }
        } else {
            return (
                <>
                    <li onClick={closeSidebar}><NavLink to='/login'>Авторизация</NavLink></li>
                    <li onClick={closeSidebar}><NavLink to='/register'>Регистрация</NavLink></li>
                </>
            )
        }
    }

    return (
        <header>
            <Nav>
                <div className="nav-wrapper blue darken-1">
                    <NavLink to='/' className='brand-logo'>Work Hunter</NavLink>
                    <a data-target="mobile-demo" className="sidenav-trigger">
                        <i className="material-icons cursor-pointer">menu</i>
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><NavLink to='/questionnaires'>Анкеты</NavLink></li>
                        {role()}
                    </ul>
                </div>
            </Nav>

            <ul ref={sideBarRef} className="sidenav" id="mobile-demo">
                <li onClick={closeSidebar}><NavLink to='/questionnaires'>Анкеты</NavLink></li>
                {role()}
            </ul>
        </header>

    );
};

export default NavBar;
