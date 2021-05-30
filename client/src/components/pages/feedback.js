import React, {useEffect} from 'react';
import M from 'materialize-css'
import {useHistory} from "react-router-dom";

const Feedback = ({feedback}) => {
	const history = useHistory()
	useEffect(() => {
		M.Modal.init(document.querySelectorAll('.modal'));
	}, []);

	const toDate = date => {
		return new Intl.DateTimeFormat('ru-RU', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(new Date(date))
	}

	const checkRes = (response, rejection) => {
		if (response) {
			return (
				<span className="secondary-content green-text">
					<i className="material-icons">
						done
					</i>
				</span>
			)
		} else if (rejection) {
			return (
				<span className="secondary-content red-text">
					<i className="material-icons">
						clear
					</i>
				</span>
			)
		} else {
			return (
				<span className="secondary-content grey-text">
					<i className="material-icons">
						send
					</i>
				</span>
			)
		}
	}

	const renderFeedback = () => {
		return (
			<ul className='collection'>
				{feedback.map(feed => {
					return (
						<li
							key={feed._id}
							data-target="chat"
							className="collection-item avatar cursor-pointer modal-trigger"
							onClick={() => history.push(`/questionnairesDetail/${feed.form._id}`)}
						>
							<img src={feed.form.img} alt={feed.form.teacher.FULL_NAME} className="circle"/>
							<span className="title">{feed.form.teacher.FULL_NAME}</span>
							<p>
								{`Вы: ${feed.transmittalLetter}`} <a href={`tel:+7${feed.userPhone}`}>7{feed.userPhone}</a> <br/>
								{toDate(feed.date)}
								{feed.answer.length ? feed.answer : null}
							</p>
							{checkRes()}
						</li>
					)
				})}
			</ul>
		)
	}

	return (
		<div className='row margin-top-custom'>
			{!feedback.length ? <h5>У вас нет откликов</h5> : renderFeedback()}
		</div>
	)
};

export default Feedback;
