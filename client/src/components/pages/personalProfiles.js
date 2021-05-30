import React from 'react';
import {Link} from "react-router-dom";
import styled from "styled-components";

const DeleteBtn = styled.button`
  border: none;
  background-color: transparent;
  position: absolute;
  right: 0;
  top: 5px;
  cursor: pointer;

  &:focus {
    background-color: transparent;
  }
`

const PersonalProfiles = ({forms, deleteForm}) => {
	const normalizePrice = (price) => {
		return new Intl.NumberFormat('ru-RU', {
			currency: 'rub',
			style: 'currency'
		}).format(price)
	}

	return (
		<div className="row margin-top-custom">
			{!forms.length ? <h5>Вы ни создали ни одной анкеты</h5> : null}
			{forms.map((form) => {
				return (
					<div className="col s12 m6 l5 xl4" key={form._id}>
						<div className="card hoverable" style={{position: 'relative'}}>
							<DeleteBtn onClick={() => deleteForm(form._id)}>
								<i className="material-icons">delete</i>
							</DeleteBtn>

							<div className="card-content">
								<span className="card-title h6">
									Ваша анкета
								</span>
								<p>{form.subjects}</p>
								<p className=''>{normalizePrice(form.price)}</p>
							</div>
							<div className="card-action">
								<Link to={`/editForm/${form._id}`} className='black-text edit-link-custom'>
									<i className='material-icons'>edit</i>
								</Link>
								<Link
									className='blue-text darken-1 margin-left-custom'
									to={`/questionnairesDetail/${form._id}`}
								>
									Открыть
								</Link>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	);
};

export default PersonalProfiles
