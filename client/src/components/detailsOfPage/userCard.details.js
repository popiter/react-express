import React from 'react';

const UserCard = ({users, deleteUser}) => {


    return (
        <table>
            <thead>
            <tr>
                <th>ФИО</th>
                <th>Почта</th>
                <th>Роль</th>
                <th>Удалить</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr key={user._id}>
                    <td>{user.FULL_NAME}</td>
                    <td>{user.email}</td>
                    <td>{user.isTeacher ? 'Продавец' : 'Покупатель'}</td>
                    <td>
                        <button
                            onClick={() => deleteUser(user._id)}
                            className='btn blue'>
                            Удалить
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default UserCard;
