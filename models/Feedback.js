const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	// дата отклика
	date: {
		type: Date,
		default: Date.now
	},
	// положителльный ответ преподователя
	response: {
		type: Boolean,
		default: false
	},
	// отрицательный ответ преподователя
	rejection: {
		type: Boolean,
		default: false
	},
	// телефон юзера
	userPhone: {
		type: String,
		required: true
	},
	// телефон учителя
	teacherPhone: {
		type: String,
		default: ''
	},
	// id анкеты на которую откликнулись
	form: {
		type: mongoose.Types.ObjectId,
		ref: 'Form'
	},
	// id пользователя который откликнулся
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	//сопроводительное письмо
	transmittalLetter: {
		type: String,
		required: true
	},
	// ответ преподователя
	answer: {
		type: String,
		default: ''
	}
})

module.exports = mongoose.model('Feedback', schema)