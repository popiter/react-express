const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const User = require('../models/User')
const router = Router()

router.get(
	'/isAuth',
	auth,
	async (req, res) => {
	try {
		const user = await User.findById(req.user.userId)
		if (!user) {
			return res.status(500).json({message: 'Пользователь не найден'})
		}
		res.status(200).json({message: 'Запрос прошел успешно'})
	} catch (e) {
		res.status(500).json({message: 'Пользователь не найден'})
	}
})

module.exports = router