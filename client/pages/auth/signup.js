import { useState } from 'react'
import { useRouter } from 'next/router'
import useRequest from '../../hooks/use-request'

const signup = () => {
  const Router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await doRequest()
    setLoading(false)
  }

  return (
    <div className='container-fluid p-0'>
      <div
        id='carouselContent'
        className='carousel slide mt-1'
        data-ride='carousel'
        style={{ backgroundColor: '#33ccff' }}
      >
        <div className='carousel-inner' role='listbox'>
          <div className='carousel-item active  p-4' style={{ color: 'white' }}>
            <h4>Signup</h4>
            <small>Sign up to become part of the community</small>
          </div>
        </div>
        <br />
        <br />
      </div>
      <div className='row mt-4'>
        <div className='col-md-4 offset-4'>
          <form onSubmit={onSubmit}>
            <div className='form-group pb-2'>
              <label>Email </label>
              <input
                type='email'
                className='form-control'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label>password</label>
              <input
                type='password'
                className='form-control'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br />
            {loading ? (
              <>
                <div className='spinner-border' role='status'></div>
              </>
            ) : (
              <button className='btn btn-primary '>Sign Up</button>
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

export default signup
