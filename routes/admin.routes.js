const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const AdminMessage = require('../models/AdminMessage')
const Users = require('../models/User')
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const router = Router()

router.post(
    '/createNewMessageOnForm',
    auth,
    async (req, res) => {
        try {
            const {idForm, idUser, adminMessage, dateSentByAdmin} = req.body

            const message = new AdminMessage({
                idForm, idUser, adminMessage, dateSentByAdmin
            })
            await message.save()
            res.status(201).json({message: 'Сообщение успешно отправлено'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

router.get(
    '/userGetAdminMessage',
    auth,
    async (req, res) => {
        try {
            const message = await AdminMessage.find(
                {idUser: req.user.userId, deleteMessageByUser: false}
            )
            res.json(message)
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

router.get(
    '/adminGetAdminMessage',
    auth,
    async (req, res) => {
        try {
            const message = await AdminMessage.find()
            res.json(message)
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

router.post(
    '/deleteAdminMessage',
    auth,
    async (req, res) => {
        try {
            await AdminMessage.findByIdAndUpdate(req.body.id, {deleteMessageByUser: true})
            res.json({message: 'Уведомление успешно удалено'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

router.get(
    '/users',
    auth,
    async (req, res) => {
        try {
            const users = await Users.find({_id: {$ne: req.user.userId}})
            res.json(users)
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

router.get(
    '/deleteUser',
    auth,
    async (req, res) => {
        try {
            const idUser = req.query.id
            const allFeedback = await Feedback.find(
                {},
                {'form': 1})
                .populate({
                    path: 'form',
                    select: 'teacher'
                })
            const idTeacherForm = allFeedback.filter(item => `${item.form.teacher}` === idUser).map(item => item.form._id)
            if (idTeacherForm.length) {
                await Feedback.deleteMany({form: {$in: idTeacherForm} })
            }
            await User.findById(idUser, function (err, user) {
                user.remove()
                res.json({message: 'Аккаунт успешно удален'})
            })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так'})
        }
    }
)

module.exports = router