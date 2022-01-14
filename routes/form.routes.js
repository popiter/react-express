const {Router} = require('express')
const Form = require('../models/Form')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post(
	'/create',
	auth,
	async (req, res) => {
		try {
			const {price, img, subjects, aboutMe} = req.body

			const form = new Form({
				price, img, subjects, aboutMe, teacher: req.user.userId
			})

			await form.save()
			res.status(201).json({message: 'Анкета успешно создана'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.get('/', async (req, res) => {
	try {
		const forms = await Form.find(
			{},
			{
				"_id": 1,
				'price': 1,
				'subjects': 1,
				'teacher': 1
			})
			.populate('teacher', 'FULL_NAME -_id')

		res.json(forms)
	} catch (e) {
		res.status(500).json({message: 'Что-то пошло не так'})
	}
})

router.get(
	'/personal',
	auth,
	async (req, res) => {
		try {
			const forms = await Form.find(
				{teacher: req.user.userId},
				{
					"_id": 1,
					'price': 1,
					'subjects': 1,
				})
				.populate('teacher', 'FULL_NAME -_id')

			res.json(forms)
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	}
)

router.get(
	'/searchForms',
	async (req, res) => {
		try {
			console.log(req.query.search)
			const search = new RegExp(req.query.search, 'gi')
			const forms = await Form.find(
				{'subjects': search},
				{
					"_id": 1,
					'price': 1,
					'subjects': 1,
					'teacher': 1
				})
				.populate('teacher', 'FULL_NAME -_id')

			res.json(forms)
		} catch (e) {
			res.status(500).json({message: 'Что пошло не так'})
		}
	}
)

router.post(
	'/delete',
	auth,
	async (req, res) => {
		try {
			await Form.deleteOne({_id: req.body.id})
			res.json({message: 'Анкета успешно удалена'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	}
)

router.post(
	'/editForm',
	auth,
	async (req, res) => {
		try {
			const {id} = req.body
			delete req.body.id
			await Form.findByIdAndUpdate(id, req.body)
			res.json({message: 'Анкета успешно обновлена'})
		} catch (e) {
			res.status(500).json({message: 'Что-то пошло не так'})
		}
	})

router.get('/:id', async (req, res) => {
	try {
		const form = await Form.findById(
			req.params.id,
			{
				'price': 1,
				'img': 1,
				'subjects': 1,
				'date': 1,
				'aboutMe': 1,
			})
			.populate('teacher', 'FULL_NAME')

		res.json(form)
	} catch (e) {
		res.status(500).json({message: 'Что-то пошло не так'})
	}
})

module.exports = router