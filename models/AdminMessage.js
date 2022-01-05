const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	// id админа
	idAdmin: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	// id пользователя
	idUser: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	idForm: {
		type: mongoose.Types.ObjectId,
		ref: 'Form'
	},
	// сообщение админа
	adminMessage: {
		type: String,
		default: ''
	},
	// сообщение пользователя
	userMessage: {
		type: String,
		default: ''
	},
	// выполнена ли просьба админа
	decided: {
		type: Boolean,
		default: false
	},
	// удалено ли уведомление пользователем
	deleteMessageByUser: {
		type: Boolean,
		default: false
	},
	// дата отправки сообщение админом
	dateSentByAdmin: {
		type: Date,
		default: ''
	},
	// дата отправки сообщение пользователем
	dateSentByUser: {
		type: Date,
		default: ''
	}
})

module.exports = mongoose.model('AdminMessage', schema)