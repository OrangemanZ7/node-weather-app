const express = require("express")
const path = require("path")
const hbs = require("hbs")
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")

const app = express()
const port = process.env.PORT || 3000

// Define paths dor Express config
const publicPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup handlebars engine and views/partials location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicPath))

// GET Home page
app.get("", (req, res) => {
  res.render("index", { title: "Weather", name: "Ricardo", show: false })
})

// GET About page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Ricardo",
    message:
      "This is site was created by this awesome guy. It fetches data from mapbox.com and darksky.net APIs",
  })
})

// GET Help page
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Ricardo",
    message: "Some help text goes here...",
  })
})

// GET weather page
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.render("index", {
      title: "Weather",
      name: "Ricardo",
      show: false,
      error: true,
      message: "No address was typed...",
    })
  }

  geocode(req.query.address, (error, data) => {
    if (error) {
      return res.render("index", {
        title: "Weather",
        name: "Ricardo",
        show: false,
        error: true,
        message: error,
      })
    }
    forecast(data, (error, forecastData) => {
      if (error) {
        return res.render("index", {
          title: "Weather",
          name: "Ricardo",
          show: false,
          error: true,
          message: error,
        })
      }
      response = { ...forecastData, address: req.query.address }
      res.render("index", {
        title: "Weather",
        name: "Ricardo",
        summary: response.summary,
        temperature: response.temperature,
        precipProb: response.precipProbability,
        location: response.local,
        show: true,
        error: false,
      })
    })
  })
})

// GET Help/404 Error page
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Ricardo",
    message: "Help page not found",
  })
})

// GET 404 Error page
app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Ricardo",
    message: "Page not found",
  })
})

// Start listening on defined port
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})
