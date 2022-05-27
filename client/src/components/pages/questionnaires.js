import React, {useCallback, useEffect, useState} from 'react';
import useHttp from "../../hooks/http.hook";
import {QuestionnairesDetails} from "../detailsOfPage";
import {LoaderCircular} from "../loader";
import useMessage from '../../hooks/message.hook'

const Questionnaires = () => {
    const [forms, setForm] = useState([]);
    const [search, setSearch] = useState('');
    const {request, loading} = useHttp()
    const message = useMessage()

    /**
     * Получение всех анкет
     * @type {(function(): Promise<void>)|*}
     */
    const getForms = useCallback(async () => {
        try {
            const data = await request('/api/form', 'GET', null, {})
            setForm(data)
        } catch (e) {
            message('Что-то пошло не так')
        }
    }, [request]);

    const getFormsSearch = async (e, searchForms) => {
        e.preventDefault()
        if (!searchForms) {
            try {
                const data = await request('/api/form', 'GET', null, {})
                setForm(data)
            } catch (e) {
                message('Что-то пошло не так')
            }
        } else {
            try {
                const forms = await request(`/api/form/searchForms?search=${searchForms}`, 'GET')
                setForm(forms)
                setSearch('')
                if (!forms.length) {
                    message('Ни одной анкеты не найдено')
                }
            } catch (e) {
                message('Что-то пошло не так')
            }
        }

    }

    const changeInputSearch = (e) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        document.title = 'Анкеты'
        getForms()
    }, [getForms])

    return (
        <>
            <div className="row" style={{paddingTop: '10px', marginBottom: 0}}>
                <div className="col s12">
                    <form onSubmit={(e) => getFormsSearch(e, search)}>
                        <div style={{display: 'flex', alignItems: 'center'}} className="row">
                            <div className="input-field blue-prefix col m5 l5 xl6 offset-xl6 offset-l5 offset-m5">
                                <i className="material-icons prefix">search</i>
                                <input
                                    value={search}
                                    onChange={changeInputSearch}
                                    id="icon_prefix"
                                    type="text"
                                    className="blue-textarea black-text"/>
                                <label htmlFor="icon_prefix">Поиск по предмету</label>
                            </div>
                            <div className="col s4 m2 l2 xl2">
                                <button className='btn blue' type='submit'>Поиск</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {loading ? <LoaderCircular/> : <QuestionnairesDetails forms={forms}/>}
        </>
    )
}

export default Questionnaires;
