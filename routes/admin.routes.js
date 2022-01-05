const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const AdminMessage = require('../models/AdminMessage')
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
                {idUser: req.user.userId}
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

module.exports = router