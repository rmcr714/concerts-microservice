import axios from 'axios'

const BuildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //if on server

    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    }) //this is how we create  a base version of axios to be used everywhere
  } else {
    //if on browser
    return axios.create({
      baseURL: '/',
    })
  }
}

export default BuildClient
