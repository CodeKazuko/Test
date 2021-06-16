import express from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.png`)
  },
})

const upload = multer({ storage })
const router = express.Router()

router.post('/', upload.single('image'), (req, res) => {
  res.status(201).send({ image: `/${req.file.path}` })
})

export default router
