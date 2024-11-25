const express = require ('express')
const { getApi } = require('./nc_controllers/app.controller')

const app = express()

app.get('/api', getApi)

module .exports = app