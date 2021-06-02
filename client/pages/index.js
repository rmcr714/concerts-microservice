import axios from 'axios'
import BuildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  console.log(currentUser)
  return currentUser ? (
    <h4>youre signed in as {currentUser.email}</h4>
  ) : (
    <h4>youre not signed in</h4>
  )
}

//getInital props is used for server side rendering , normal axios request are made by browser but the request inside this block are made in the next server at the time of processing
//improves performance
LandingPage.getInitialProps = async (context) => {
  //this request will be done on server side, so we need to provide the address of the ingress service . In normal react app,
  //we send html to browser and browser makes request and populates the html with data returned from node backend,but in this
  //the request will be processed in next js pod in our cluser(one of the benefits of next js).But inside that pod we need to tell
  //it to go to the ingress service so that it could take the request to the auth or any other pod and then return the data. Because of
  //all this the domain will be of the ingress service and a little weird(learn this we just have to change the domain a little bit)

  const { data } = await BuildClient(context).get('/api/users/currentuser') //we are creating a custom axios in buildrequest file and using it here

  return data
}

export default LandingPage
