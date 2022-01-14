import React, {useCallback, useEffect, useState} from 'react';
import useHttp from "../../hooks/http.hook";
import {useParams} from "react-router-dom";
import {LoaderCircular} from "../loader";
import {EditDetails} from "../detailsOfPage";

const EditForm = () => {
	const {request, loading} = useHttp()
	const [form, setForm] = useState(null);
	const formId = useParams().id

	/**
	 * Получение формы по id
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
		document.title = 'Изменение анкеты'
		getForm()
	}, [getForm]);

	if (loading) {
		return <LoaderCircular/>
	}

	return (
		<>
			{!loading && form && <EditDetails form={form}/>}
		</>
	);
};

export default EditForm;
