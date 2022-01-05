const mongoose = require('mongoose')
const Form = require('./Form')
const Feedback = require('./Feedback')

const schema = new mongoose.Schema({
	// полное имя юзера
	FULL_NAME: {type: String, required: true},
	// электронная почта юзера
	email: {type: String, required: true, unique: true},
	// пароль юзера
	password: {type: String, required: true},
	// является ли юзер учителем
	isTeacher: {type: Boolean, required: true},
	// является ли юзер админом
	isAdmin: {type: Boolean, default: false}
})

schema.pre('remove', function (next) {
	Form.deleteMany({teacher: this._id}).exec()
	Feedback.deleteMany({user: this._id}).exec()
	next()
})

module.exports = mongoose.model('User', schema)