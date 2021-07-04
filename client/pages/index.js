import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  return (
    <div className='container-fluid'>
      <div
        id='carouselContent'
        className='carousel slide mt-1'
        data-ride='carousel'
        style={{ backgroundColor: 'black' }}
      >
        <div className='carousel-inner' role='listbox'>
          <div
            className='carousel-item active  p-4 text-center'
            style={{ color: 'white' }}
          >
            <h1>Concertify!</h1>
            <br />
            <br />
            <h4>The Best Tickets at the cheapest prices</h4>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
      <br />
      <br />
      <h3>All available Tickets</h3>
      <div className='row'>
        {tickets.map((ticket) => (
          <div className='col-md-4'>
            <div className='card mb-4'>
              <img
                className='card-img-top'
                src='https://pngimg.com/uploads/guitar/guitar_PNG3374.png'
                style={{ height: '150px', objectFit: 'cover' }}
                alt='Card image cap'
              />
              <div className='card-body'>
                <h5 className='card-title'>{ticket.title}</h5>
                <p className='card-text'>Rs: {ticket.price}</p>
                <Link href={`/tickets/${ticket.id}`}>
                  <a className='btn btn-primary'>Purchase</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

//getInital props is used for server side rendering , normal axios request are made by browser but the request inside this block are made in the next server at the time of processing
//improves performance
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets')

  return { tickets: data }
}

export default LandingPage
