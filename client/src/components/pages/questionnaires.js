import React, {useCallback, useEffect, useState} from 'react';
import useHttp from "../../hooks/http.hook";
import {QuestionnairesDetails} from "../detailsOfPage";
import {LoaderCircular} from "../loader";

const Questionnaires = () => {
	const [forms, setForm] = useState([]);
	const {request, loading} = useHttp()

	/**
	 * Получение всех анкет
	 * @type {(function(): Promise<void>)|*}
	 */
	const getForms = useCallback(async () => {
		try {
			const data = await request('/api/form', 'GET', null, {})
			setForm(data)
		} catch (e) {
		}
	}, [request]);

	useEffect(() => {
		document.title = 'Анкеты'
		getForms()
	}, [getForms])

	return (
		<>
			{loading ? <LoaderCircular/> : <QuestionnairesDetails forms={forms}/>}
		</>
	)
}

export default Questionnaires;
