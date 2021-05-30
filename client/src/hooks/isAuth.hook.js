import {useCallback, useContext, useEffect} from "react";
import useHttp from "./http.hook";
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom";


const useIsAuth = (redirect) => {
	const auth = useContext(AuthContext)
	const {request} = useHttp()
	const history = useHistory()
	const isAuth = useCallback(async () => {
		try {
			await request('/api/isAuth', 'GET', null, {Authorization: `Bearer ${auth.token}`})
		} catch (e) {
			auth.logout()
			if (redirect) {
				history.push('/login')
			}
		}
	}, [request, auth, history, redirect]);

	useEffect(() => {
		isAuth()
	}, [isAuth])
};

export default useIsAuth;
