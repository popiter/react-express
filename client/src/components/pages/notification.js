import React from 'react';

const Notification = ({adminMessage}) => {
    return (
        <>
            {!adminMessage.length ? <h5>У вас нет уведомлений</h5> : ''}
            <ul className='collection'>
                {adminMessage.map(message => (
                    !message.deleteMessageByUser ?
                        <li
                            key={message._id}
                            className="collection-item avatar"
                        >
                            <i style={{fontSize: 42}} className="material-icons circle blue">admin_panel_settings</i>
                            <span className="title">Уведомление от администратора</span>
                            <p>{message.adminMessage} <br/>
                                Second Line
                            </p>
                        </li>
                        : ''
                ))}
            </ul>
        </>
    );
};

export default Notification;
