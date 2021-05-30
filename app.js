const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({limit: '50mb', extended: true}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use('/api', require('./routes/isAuth'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/form', require('./routes/form.routes'))
app.use('/api/feedback', require('./routes/feedback.routes'))

const PORT = config.get('port') || 5000

async function start () {
	try {
		await mongoose.connect(config.get('mongoUri'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})
		app.listen(PORT, () => console.log(`app on port ${PORT}`))
	} catch (e) {
		console.log('server error', e.message)
		process.exit(1)
	}
}

start()

