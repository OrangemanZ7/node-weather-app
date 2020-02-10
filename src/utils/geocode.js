const request = require("request")

const mapBoxToken =
  "pk.eyJ1Ijoib3JhbmdlbWFueiIsImEiOiJjazZiNWt1dDYweHBoM21vZGxtYzNqMWVlIn0.XvelivBjk-9HXS_ULQ5fvw"

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapBoxToken}`
  request.get({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services!", undefined)
    } else if (body.features.length === 0) {
      callback("Unable to find location, try another search.", undefined)
    } else {
      const { place_name: local, center: coords } = body.features[0]
      const data = { local, coords }
      callback(undefined, data)
    }
  })
}

module.exports = geocode
