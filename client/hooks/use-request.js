import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setErrors(
        <>
          {err.response.data.errors.map((err) => (
            <h6 key={err.message} className='alert alert-danger mt-2'>
              {err.message}
            </h6>
          ))}
        </>
      )
    }
  }

  return { doRequest, errors }
}
