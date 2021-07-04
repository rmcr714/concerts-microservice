import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const TicketShow = ({ ticket, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })

  return (
    <div className='container-fluid'>
      <div
        id='carouselContent'
        className='carousel slide mt-1'
        data-ride='carousel'
        style={{ backgroundColor: 'green' }}
      >
        <div className='carousel-inner' role='listbox'>
          <div className='carousel-item active  p-4' style={{ color: 'white' }}>
            <h4>Make Purchase</h4>
            <small>All types of debit and credit cards accepted </small>
          </div>
        </div>
        <br />
      </div>
      <br />
      <div class='row'>
        <div className='col-md-1 offset-3'>
          {currentUser ? (
            <span className='text-success h4'>&nbsp;&nbsp;Login</span>
          ) : (
            <span className='text-danger h4'>&nbsp;&nbsp;Login</span>
          )}
        </div>
        <div className='col-md-1'>
          <hr />
        </div>
        <div className='col-md-1 '>
          {currentUser ? (
            <span className='text-success h4'>Purchase</span>
          ) : (
            <span className='text-danger h4'>Purchase</span>
          )}
        </div>
        <div className='col-md-1'>
          <hr />
        </div>
        <div className='col-md-1 '>
          <span className='text-danger h4'> Payment</span>
        </div>
      </div>
      <br />
      <br />
      <div className='row'>
        <div className='col-md-4 offset-4'>
          <div className='card' style={{ width: '25rem', height: '18rem' }}>
            <img
              className='card-img-top'
              src='https://pngimg.com/uploads/crowd/crowd_PNG42.png'
              style={{ height: '150px', objectFit: 'cover' }}
              alt='Card image cap'
            />
            <div className='card-body'>
              <h5 className='card-title'>{ticket.title}</h5>
              <p className='card-text'>Rs {ticket.price}</p>
              <button onClick={() => doRequest()} className='btn btn-primary'>
                Purchase
              </button>
              {errors}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow
