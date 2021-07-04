const OrderIndex = ({ orders }) => {
  return (
    <div className='container-fluid'>
      <br />

      <h3>My Orders</h3>
      <br />
      <div className='row'>
        <div className='col-md-6 offset-1'>
          {orders &&
            orders.map((order) => (
              <>
                <div className='card'>
                  <div className='card-header h4'>{order.ticket.title}</div>
                  <div className='card-body'>
                    <h5 className='card-title'>
                      Price : {order.ticket.price}{' '}
                    </h5>
                    {order.status === 'cancelled' ? (
                      <p className='card-text text-danger h4'>
                        Order Status : {order.status}
                      </p>
                    ) : (
                      <p className='card-text text-success h4'>
                        Order Status: {order.status}
                      </p>
                    )}
                  </div>
                </div>
                <br />
              </>
            ))}
        </div>
      </div>
    </div>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')
  return { orders: data }
}

export default OrderIndex
