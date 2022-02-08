const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	// дата публикации поста
	date: {
		type: Date,
		default: Date.now
	},
	// цена за услугу
	price: {
		type: Number,
		required: true
	},
	// фото продовца
	img: {
		type: String,
		required: true
	},
	// предмет который ведет
	subjects: {
		type: String,
		required: true
	},
	//О себе
	aboutMe: {
		type: String,
		required: true
	},
	//id пользователя кем была созданана анкета/резюме
	teacher: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
})

module.exports = mongoose.model('Form', schema)