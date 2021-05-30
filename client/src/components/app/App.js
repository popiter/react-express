import React from "react"
import Routes from "../routes/";
import useAuth from "../../hooks/auth.hook";
import {AuthContext} from "../../context/AuthContext";
import NavBar from "../navbar";
import 'materialize-css'
import Footer from "../footer";

function App () {
	const {token, login, logout, userId, isTeacher, isAdmin} = useAuth()
	const isAuthenticated = !!token
	const routes = Routes(!!isAuthenticated, isTeacher, isAdmin)
	return (
		<AuthContext.Provider value={{
			token, login, logout, userId, isAuthenticated, isTeacher, isAdmin
		}}>
			<>
				<NavBar/>
				<main>
					<div className="container">
						{routes}
					</div>
				</main>
				<Footer/>
			</>
		</AuthContext.Provider>
	)
}

export default App
