const {Router} = require('express')
const Feedback = require('../models/Feedback')
const Form = require('../models/Form')
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const router = Router()

router.post(
	'/create',
	auth,
	async (req, res) => {
		try {
			const {form, transmittalLetter, userPhone} = req.body

			const candidate = await Feedback.findOne({user: req.user.userId, form})

			if (candidate) {
				return res.status(500).json({message: 'Вы уже откликались на эту вакансию'})
			}

			const feedback = new Feedback({
				form,
				transmittalLetter,
				userPhone,
				user: req.user.userId
			})

			await feedback.save()
			res.status(201).json({message: 'Отклик отправлен'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.get(
	'/personal',
	auth,
	async (req, res) => {
		try {
			const responses = await Feedback.find(
				{user: req.user.userId},
				{
					'date': 1,
					'response': 1,
					'rejection': 1,
					'transmittalLetter': 1,
					'teacherPhone': 1,
					'userPhone': 1,
					'answer': 1
				})
				.populate({
					path: 'form',
					select: 'teacher img price subjects',
					populate: {
						path: 'teacher',
						select: 'FULL_NAME -_id'
					}
				})
				.populate('user', 'FULL_NAME -_id')

			res.json(responses)
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.get(
	'/teacherFeedback',
	auth,
	async (req, res) => {
		try {
			const formId = await Form.find({teacher: req.user.userId}, {'_id': 1})
			const arrFormId = formId.map((el) => el._id)
			const feedback = await Feedback.find(
				{form: {$in: arrFormId}},
				{
					'date': 1,
					'response': 1,
					'rejection': 1,
					'transmittalLetter': 1,
					'teacherPhone': 1,
					'userPhone': 1,
					'answer': 1
				})
				.populate({
					path: 'form',
					select: 'teacher img price subjects',
					populate: {
						path: 'teacher',
						select: 'FULL_NAME -_id'
					}
				})
				.populate('user', 'FULL_NAME -_id')

			res.json(feedback)
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.post('/rejectionTeacher',
	auth,
	async (req, res) => {
		try {
			await Feedback.findByIdAndUpdate(req.body.id, {rejection: true})

			res.json({message: 'Отклик успешно отказан'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.post('/responseTeacher',
	auth,
	async (req, res) => {
		try {
			const {id} = req.body
			delete req.body.id
			await Feedback.findByIdAndUpdate(id, req.body)

			res.json({message: 'Собщение отправлено'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

module.exports = router