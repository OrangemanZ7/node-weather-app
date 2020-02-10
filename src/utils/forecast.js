const request = require("request")

const darkSkyKey = "530c12e1ad95a72cbe1c78103ccbc100"

const forecast = ({ local, coords }, callback) => {
  const latitude = coords[1]
  const longitude = coords[0]
  const url = `https://api.darksky.net/forecast/${darkSkyKey}/${latitude},${longitude}?lang=pt&units=auto`
  request.get({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined)
    } else if (body.error) {
      callback("Unable to find location!", undefined)
    } else {
      const { temperature, precipProbability } = body.currently
      const summary = body.daily.data[0].summary
      const weatherData = {
        local,
        latitude,
        longitude,
        temperature,
        precipProbability,
        summary,
      }
      callback(undefined, weatherData)
    }
  })
}

module.exports = forecast
