import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import config from './config'
import userRoute from './routes/userRoute'
import uploadRoute from './routes/uploadRoute'
import productRoute from './routes/productRoute'
import orderRoute from './routes/orderRoute'

const mongodbUrl = config.MONGODB_URL
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).catch((error) => console.log(error.reason))

const app = express()

// limit request
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
})

// security measures
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(cors())
app.use(express.json())
app.use('/api/', apiLimiter)

// for routes
app.use('/api/users', userRoute)
app.use('/api/uploads', uploadRoute)
app.use('/api/products', productRoute)
app.use('/api/orders', orderRoute)
app.get('/api/paypal/clientId', (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID })
})

app.use('/uploads', express.static(path.join(__dirname, '/../uploads')))
app.use(express.static(path.join(__dirname, '/../frontend')))
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`)) 
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500
  res.status(status)
  res.send({ message: err.message })
})

app.listen(config.PORT, () => {
  console.log('Server started at http://localhost:5000')
})
