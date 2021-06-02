import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useRequest from '../../hooks/use-request'

const signout = () => {
  const Router = useRouter()
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  })

  useEffect(() => {
    doRequest()
  }, [])

  return <div>Signing u out ...</div>
}

export default signout
