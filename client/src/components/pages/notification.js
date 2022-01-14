import React, {useContext} from 'react';
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

const DivButton = styled.div`
  position: absolute;
  right: 20px;
  bottom: 10px;

  button {
    margin-right: 10px;

    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
`

const ButtonDelete = styled.button`
  border: none;
  background-color: transparent;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;

  &:focus {
    background-color: transparent;
  }
`

const Notification = ({adminMessage, deleteMessageAdmin}) => {
    const history = useHistory()
    const {isAdmin} = useContext(AuthContext);

    /**
     * Открытие анкеты
     * @param id
     * @returns {(function(): void)|*}
     */
    const openForm = (id) => {
        return () => {
            history.push(`/questionnairesDetail/${id}`)
        }
    }

    /**
     * Форматирование даты
     * @param date
     * @returns {string}
     */
    const toDate = date => {
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(new Date(date))
    }

    const render = () => (
        <ul className='collection'>
            {adminMessage.map(message => (
                <li
                    key={message._id}
                    className="collection-item avatar"
                >
                    {!isAdmin ?
                        <ButtonDelete onClick={() => deleteMessageAdmin(message._id)}>
                            <i className="material-icons">delete</i>
                        </ButtonDelete>
                        : null
                    }

                    <div className='margin-bottom-custom'>
                        <i style={{fontSize: 42}}
                           className="material-icons circle blue">admin_panel_settings</i>
                        <span className="title">Уведомление от администратора</span>
                        <p>{message.adminMessage} <br/>
                            {toDate(message.dateSentByAdmin)}
                        </p>
                    </div>
                    <DivButton>
                        <button onClick={openForm(message.idForm)} className='btn blue'>Открыть анкету</button>
                    </DivButton>
                </li>
            ))}
        </ul>
    )

    return (
        <div className="row margin-top-custom">
            {!adminMessage.length ? <h5>У вас нет уведомлений</h5> : render()}
        </div>
    );
};

export default Notification;
