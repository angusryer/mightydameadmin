import subscribers from './subscribers';

/*
subscribers must adhere to the following schema:

type Subscriber {
  id: ID!
  subscriberEmail: String!
}
*/

async function getSubscribers() {
  return new Promise((resolve, reject) => {
    // const subscribers = API.get(apiUrl)
    resolve(subscribers)
  })
}

const DENOMINATION = '$'

export { DENOMINATION, getSubscribers as default } 
