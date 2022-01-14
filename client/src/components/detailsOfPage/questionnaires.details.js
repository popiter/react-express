import React, {useState} from 'react';
import {Link} from "react-router-dom";

const QuestionnairesDetails = ({forms}) => {
    const [search, setSearch] = useState('');

    /**
     * Форматирование цены
     * @param price
     * @returns {string}
     */
    const normalizePrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            currency: 'rub',
            style: 'currency'
        }).format(price)
    }

    return (
        <>
            {!forms.length ? <h5 className='center'>Ничего не найдено</h5> : null}
            <div className="row" style={{paddingTop: '10px'}}>
                {forms.map((form) => {
                    return (
                        <div className="col s12 m6 l5 xl4" key={form._id}>
                            <div className="card hoverable">
                                <div className="card-content">
								<span className="card-title h6">
									{form.teacher.FULL_NAME}
								</span>
                                    <p>{form.subjects}</p>
                                    <p className=''>{normalizePrice(form.price)}</p>
                                </div>
                                <div className="card-action">
                                    <Link className='blue-text darken-1'
                                          to={`/questionnairesDetail/${form._id}`}>Открыть</Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default QuestionnairesDetails;
