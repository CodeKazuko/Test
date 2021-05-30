import express from 'express'
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel'
import User from '../models/userModel'
import Product from '../models/productModel'
import { isAuth, isAdmin } from '../util'

const router = express.Router()

// showing the product is bought by which user
router.get(
  '/', isAuth, asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user')
    res.send(orders)
  })
)


router.get(
  '/mine', isAuth,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.send(orders)
  })
)


router.get(
  '/summary',
  asyncHandler(async (req, res) => {
    // summary data of orders 
    const orders = await Order.aggregate([
      {
        // not group by any specific field, calculate by number of records and /total sales
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ])
    
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ])
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          // Y mean 4 digits for year 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
    ])
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ])

    res.send({ orders, users, dailyOrders, productCategories })
  })
)

// finding a specific order
router.get(
  '/:id', isAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id })
    if (order) {
      res.send(order)
    } else {
      res.status(404).send('Order Not Found.')
    }
  })
)

// deleting order
router.delete(
  '/:id', isAuth, isAdmin,
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id })
    if (order) {
      const deletedOrder = await order.remove()
      res.send(deletedOrder)
    } else {
      res.status(404).send('Order Not Found.')
    }
  })
)

// creating new order
router.post(
  '/', isAuth,
  asyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    })
    const newOrderCreated = await newOrder.save()
    res.status(201).send({ message: 'New Order Created', data: newOrderCreated })
  })
)

// payment route
router.put(
  '/:id/pay', isAuth, 
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.payment = {
        paymentMethod: 'paypal',
        paymentResult: {
          payerID: req.body.payerID,
          orderID: req.body.orderID,
          paymentID: req.body.paymentID,
        },
      }
      const updatedOrder = await order.save()
      res.send({ message: 'Order Paid.', order: updatedOrder })
    } else {
      res.status(404).send({ message: 'Order not found.' })
    }
  })
)

// for changing to deliver status
router.put(
  '/:id/deliver', isAuth, isAdmin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
      const updatedOrder = await order.save()
      res.send({ message: 'Order Delivered.', order: updatedOrder })
    } else {
      res.status(404).send({ message: 'Order not found.' })
    }
  })
)

export default router
