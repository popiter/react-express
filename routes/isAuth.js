const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get(
	'/isAuth',
	auth,
	(req, res) => {
	try {
		res.status(200).json({message: 'Запрос прошел успешно'})
	} catch (e) {
		res.status(500).json({message: 'Что-то пошло не так'})
	}
})

module.exports = router