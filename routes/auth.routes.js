const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const auth = require('../middleware/auth.middleware')
const User = require('../models/User')
const Feedback = require('../models/Feedback')
const router = Router()

router.get(
	'/profile',
	auth,
	async (req, res) => {
		try {
			const user = await User.findById(
				req.user.userId,
				{
					"FULL_NAME": 1,
				})

			res.json(user)
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	}
)

router.post(
	'/register',
	[
		check('email', 'Некоректный email').isEmail()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некоректные данные'
				})
			}

			const {FULL_NAME, email, password, isTeacher} = req.body

			const candidate = await User.findOne({email})

			if (candidate) {
				return res.status(400).json({message: 'Такой пользователь уже существует'})
			}

			const hashedPassword = await bcrypt.hash(password, 12)
			const user = new User({
				FULL_NAME,
				email,
				password: hashedPassword,
				isTeacher
			})

			await user.save()

			res.status(201).json({message: 'Пользователь создан'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.post(
	'/login',
	[
		check('email', 'Введите корректный email').isEmail(),
		check('password', 'Введите пароль').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некоректные данные'
				})
			}

			const {email, password} = req.body

			const user = await User.findOne({email})

			if (!user) {
				return res.status(400).json({message: 'Пользователь не найден'})
			}

			const isMath = await bcrypt.compare(password, user.password)

			if (!isMath) {
				return res.status(400).json({message: 'Неверные данные для входа'})
			}

			const token = jwt.sign(
				{userId: user.id},
				config.get('jwtSecret'),
				{expiresIn: '24h'}
			)

			res.status(200).json({token, userId: user.id, isTeacher: user.isTeacher, isAdmin: user.isAdmin})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.post(
	'/updatepassword',
	auth,
	async (req, res) => {
		try {
			const {password, newPassword} = req.body

			const user = await User.findById(req.user.userId)

			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({message: 'Введен не верный пароль'})
			}

			user.password = await bcrypt.hash(newPassword, 12)
			await user.save()
			res.json({message: 'Пароль успешно обновлен'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.post(
	'/updateemail',
	auth,
	async (req, res) => {
		try {
			const {email, newEmail} = req.body

			const user = await User.findById(req.user.userId)

			if (email !== user.email) {
				return res.status(400).json({message: 'Введена не верная почта'})
			}

			user.email = newEmail

			await user.save()
			res.json({message: 'Email успешно обновлен'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.post(
	'/updatefullname',
	auth,
	async (req, res) => {
		try {
			const {newFullName} = req.body
			const user = await User.findById(req.user.userId)

			if (user.FULL_NAME === newFullName) {
				res.status(400).json({message: 'Введены не коректные данные'})
			}
			user.FULL_NAME = newFullName

			user.save()
			res.json({message: 'ФИО успешно обновлен'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.post(
	'/deleteAccount',
	auth,
	async (req, res) => {
		try {
			const allFeedback = await Feedback.find(
				{},
				{'form': 1})
				.populate({
					path: 'form',
					select: 'teacher'
				})
			const idTeacherForm = allFeedback.filter(item => `${item.form.teacher}` === req.user.userId).map(item => item.form._id)
			if (idTeacherForm.length) {
				await Feedback.deleteMany({form: {$in: idTeacherForm} })
			}
			await User.findById(req.user.userId, function (err, user) {
				user.remove()
				res.json({message: 'Аккаунт успешно удален'})
			})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

module.exports = router