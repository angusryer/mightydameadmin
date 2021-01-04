import { v4 as uuid } from "uuid"

let subscribers = [
  { subscriberEmail: "angusryer@gmail.com" },
  { subscriberEmail: "ecarlengel@gmail.com" },
  { subscriberEmail: "fitness@mightydame.com" }
]

subscribers.map( sub => {
    sub.id = uuid()
    return sub
})

export default subscribers