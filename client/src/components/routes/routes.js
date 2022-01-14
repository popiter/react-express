import React from 'react';
import {Switch, Route} from 'react-router-dom'
import {
	AuthLogin,
	CreateApplication,
	DetailQuestionnaire, EditForm,
	Home,
	PersonalArea,
	Questionnaires,
	AllUsers
} from "../pages";
import AuthRegister from "../pages/authRegister";
import Error from "../error";

const Routes = (isAuthenticated, isTeacher, isAdmin) => {
	if (isAuthenticated) {
		if (isTeacher) {
			return (
				<Switch>
					<Route path="/createApplication" exact>
						<CreateApplication/>
					</Route>
					<Route path="/" exact>
						<Home/>
					</Route>
					<Route path="/questionnaires" exact>
						<Questionnaires/>
					</Route>
					<Route path='/editForm/:id'>
						<EditForm/>
					</Route>
					<Route path="/questionnairesDetail/:id">
						<DetailQuestionnaire/>
					</Route>
					<Route path="/personalArea" exact>
						<PersonalArea/>
					</Route>
					<Route path='*' component={Error}/>
				</Switch>
			)
		} else if (isAdmin) {
			return (
				<Switch>
					<Route path="/" exact>
						<Home/>
					</Route>
					<Route path="/questionnaires" exact>
						<Questionnaires/>
					</Route>
					<Route path="/allUsers" exact>
						<AllUsers />
					</Route>
					<Route path="/questionnairesDetail/:id">
						<DetailQuestionnaire/>
					</Route>
					<Route path="/personalArea" exact>
						<PersonalArea/>
					</Route>
					<Route path='*' component={Error}/>
				</Switch>
			)
		} else {
			return (
				<Switch>
					<Route path="/" exact>
						<Home/>
					</Route>
					<Route path="/questionnaires" exact>
						<Questionnaires/>
					</Route>
					<Route path="/questionnairesDetail/:id">
						<DetailQuestionnaire/>
					</Route>
					<Route path="/personalArea" exact>
						<PersonalArea/>
					</Route>
					<Route path='*' component={Error}/>
				</Switch>
			)
		}
	}

	return (
		<Switch>
			<Route path="/" exact>
				<Home/>
			</Route>
			<Route path="/questionnaires" exact>
				<Questionnaires/>
			</Route>
			<Route path="/questionnairesDetail/:id">
				<DetailQuestionnaire/>
			</Route>
			<Route path="/login" exact>
				<AuthLogin/>
			</Route>
			<Route path="/register" exact>
				<AuthRegister/>
			</Route>
			<Route path='*' component={Error}/>
		</Switch>
	)
};

export default Routes;
