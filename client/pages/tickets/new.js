import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import { useRouter } from 'next/router'

const NewTicket = () => {
  const Router = useRouter()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  })

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return
    }

    setPrice(value.toFixed(2))
  }

  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    await doRequest()
    setLoading(false)
  }

  return (
    <div className='container-fluid p-0'>
      <div
        id='carouselContent'
        className='carousel slide mt-1'
        data-ride='carousel'
        style={{ backgroundColor: '#ff3333' }}
      >
        <div className='carousel-inner' role='listbox'>
          <div className='carousel-item active  p-4' style={{ color: 'white' }}>
            <h4>Create Ticket</h4>
            <small>Sell your ticket to the world!</small>
          </div>
        </div>
        <br />
        <br />
      </div>
      <div className='row mt-4'>
        <div className='col-md-4 offset-4'>
          <form onSubmit={onSubmit}>
            <div className='form-group pb-2'>
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>Price</label>
              <input
                value={price}
                onBlur={onBlur}
                onChange={(e) => setPrice(e.target.value)}
                className='form-control'
              />
            </div>
            <br />

            {loading ? (
              <>
                <div className='spinner-grow text-primary' role='status'></div>
              </>
            ) : (
              <button className='btn btn-primary '>Create Ticket</button>
            )}
            <br />
            {errors}

            <br />
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewTicket
