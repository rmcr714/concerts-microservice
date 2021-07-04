import { useEffect, useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

import StripeCheckout from 'react-stripe-checkout'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId) //this will be called when we go away from this page , if not put it will continue to run
      //even when we go away from this page
    }
  }, [order])

  return (
    <div className='container-fluid'>
      <br />
      <br />
      <div className='row'>
        <div className='col-md-6 offset-3'>
          <div className='card'>
            <div className='card-header h4'>Timer</div>
            <div className='card-body'>
              <h5 className='card-title h5'>
                Please pay before the timer expires
              </h5>
              <br />
              {timeLeft > 0 ? (
                <>
                  <p className='card-text text-center h1'>{timeLeft} </p>

                  <StripeCheckout
                    token={({ id }) => doRequest({ token: id })}
                    stripeKey='pk_test_51IjK3kSJRpheJUv1HMTUWNK0BnTEvia7Up7bJtw88RqlssFJmjHADA4ovtwKEgZg1e3kbJFIhKQiDvrPZZONfuU000qTrSxChz'
                    order={order.ticket.price * 100}
                    email={currentUser.email}
                  />
                  {errors}
                </>
              ) : (
                <p className='text-center text-danger h3'>Order Expired</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
