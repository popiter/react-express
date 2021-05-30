import {useCallback, useEffect, useState} from "react";

const storageName = 'userData'

const useAuth = () => {
	const [token, setToken] = useState(null);
	const [userId, setUserId] = useState(null);
	const [isTeacher, setIsTeacher] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	const login = useCallback((jwtToken, id, isTeacher, isAdmin) => {
		setToken(jwtToken)
		setUserId(id)
		setIsTeacher(isTeacher)
		setIsAdmin(isAdmin)

		localStorage.setItem(storageName, JSON.stringify({
			userId: id, token: jwtToken, isTeacher: isTeacher, isAdmin: isAdmin
		}))
	}, [])

	const logout = useCallback(() => {
		setToken(null)
		setUserId(null)
		setIsTeacher(false)
		setIsAdmin(false)
		localStorage.removeItem(storageName)
	}, [])

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem(storageName))

		if (data && data.token) {
			login(data.token, data.userId, data.isTeacher, data.isAdmin)
		}
	}, [login])


	return {login, logout, token, userId, isTeacher, isAdmin}
};

export default useAuth;
