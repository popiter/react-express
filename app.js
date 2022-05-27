const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const process = require("process");
const path = require('path')

const app = express()

app.use(express.json({limit: '50mb', extended: true}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use('/api', require('./routes/isAuth'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/form', require('./routes/form.routes'))
app.use('/api/feedback', require('./routes/feedback.routes'))
app.use('/api/admin', require('./routes/admin.routes'))

if (process.env.NODE_ENV ===  'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')))

	app.get('*', (req, res) => {
		res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

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

