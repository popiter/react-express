import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom'
import useHttp from "../../hooks/http.hook";
import {LoaderCircular} from "../loader";
import {QuestionnaireDetails} from "../detailsOfPage";

const DetailQuestionnaire = () => {
	const {request, loading} = useHttp()
	const [form, setForm] = useState(null);
	const formId = useParams().id

	/**
	 * Получание анкеты по id
	 * @type {(function(): Promise<void>)|*}
	 */
	const getForm = useCallback(async () => {
			try {
				const data = await request(`/api/form/${formId}`, 'GET', null, {})
				setForm(data)
			} catch (e) {
			}
		}, [formId, request],
	);

	useEffect(() => {
		document.title = `Анкета`
		getForm()
	}, [getForm]);

	if (loading) {
		return <LoaderCircular/>
	}

	return (
		<>
			{!loading && form && <QuestionnaireDetails form={form}/>}
		</>
	);
};

export default DetailQuestionnaire;
