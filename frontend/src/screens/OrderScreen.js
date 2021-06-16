import {  parseRequestUrl, showLoading, hideLoading, rerender, showMessage} from '../utils.js'
import { getOrder,  payOrder, deliverOrder } from '../api.js'
import { getUserInfo } from '../localStorage.js'

let order = null


const handlePayment = () => {
  window.paypal.Buttons({
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              total: order.totalPrice,
              currency: 'SGD',
            },
          },
        ],
      })
    },
    // eslint-disable-next-line func-names
    onApprove: function(data, actions) {
      // This function captures the funds from the transaction.
      // eslint-disable-next-line func-names
      return actions.order.capture().then(function(details) {
        showLoading()
        payOrder(
          order._id, {
          orderID: details.data.orderId,
          payerID: details.data.payerID,
          paymentID: details.data.paymentID,
        })
        hideLoading()
        showMessage('Payment Was Successfully.', () => {
          rerender(OrderScreen)
           })
      })
    }.render('#paypal-button-container').then(() => {
    hideLoading()
  })
  })
}
const OrderScreen = {
  after_render: async () => {
    if (!order.isPaid) {
      handlePayment()
    }
    if (document.getElementById('deliver-order-button')) {
      document.getElementById('deliver-order-button').addEventListener('click', async () => {
          await deliverOrder(order._id)
          showMessage('Order Delivered.')
          rerender(OrderScreen)
        })
    }
  },
  render: async () => {
    const request = parseRequestUrl()
    order = await getOrder(request.id)
    const { isAdmin } = getUserInfo()

    return `
      <div>
        <div class="placeorder">
          <div class="placeorder-info">
            <div>
              <h3>Shipping</h3>
              <p>
                ${order.shipping.address}, ${order.shipping.city},
                ${order.shipping.postalCode}, ${order.shipping.country},
              </p>
              <p>
                ${
                  order.isDelivered
                    ? `Delivered at ${order.deliveredAt}`
                    : 'Not Delivered.'
                }
              </p>
            </div>
            <div>
              <h3>Payment</h3>
              <p>Payment Method: ${order.payment.paymentMethod}</p>
              <p>
                ${order.isPaid ? `Paid at ${order.paidAt}` : 'Not Paid.'}
              </p>
            </div>
            <div>
              <ul class="cart-list-container">
                <li>
                  <h3>Shopping Cart</h3>
                  <div>Price</div>
                </li>
                ${
                  order.orderItems.length === 0
                    ? `<div>Cart is empty</div>`
                    : order.orderItems.map(
                        (item) =>
                          `<li key={item._id}>
                          <div class="cart-image">
                          <img src="${item.image}" alt="${item.name}" />
                          </div>
                          <div class="cart-name">
                            <div>
                              <a href="/#/product/${item.product}">
                                ${item.name}
                              </a>
                            </div>
                            <div>Qty: ${item.qty}</div>
                          </div>
                          <div class="cart-price">$${item.price}</div>
                        </li>`
                      )
                }
              </ul>
            </div>
          </div>
          <div class="placeorder-action">
            <ul>
              <li>
                <h3>Order Summary</h3>
              </li>
              <li>
                <div>Items</div>
                <div>$${order.itemsPrice}</div>
              </li>
              <li>
                <div>Shipping</div>
                <div>$${order.shippingPrice}</div>
              </li>
              <li>
                <div>Tax</div>
                <div>$${order.taxPrice}</div>
              </li>
              <li class="total">
                <div>Order Total</div>
                <div>$${order.totalPrice}</div>
              </li> 
              <li class="placeorder-actions-payment">
                ${!order.isPaid ? `<div id="paypal-button-container"></div>` : ''}
              </li>
              <li  >
                ${
                  order.isPaid && !order.isDelivered && isAdmin
                    ? `<button id="deliver-order-button" class="primary fw">Deliver Order</button>`
                    : ''
                 }
              </li>
            </ul>
          </div>
        </div>
      </div>
      <script src="https://www.paypal.com/sdk/js?client-id=AUGl0tRZYZ00SlfmqSibGKFNJYO0mLJSebg1euH-S_MTfhsX9xcm9FiCchKsoF6UMBO4XLVq-bDIla-g&disable-funding=credit,card"> /
    </script>
      <script>paypal.Buttons().render('#paypal-button-container');</script>
      `
  },
}

export default OrderScreen
