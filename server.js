import express from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
let port = 3000
const __dirname = path.resolve(path.dirname(''))

app.use('/client', express.static(__dirname + '/client'));

let logs = []
fs.readFile(__dirname + '/logs.json', (err, data) => {
  if (!err) {
    logs = JSON.parse(data.toString()).map((it) => {
      return {
        ...it,
        reportTime: new Date(it.reportTime)
      }
    })
  }
})

function createDefaultResponse() {
  return {
    'responseCode': 200,
    'message': ''
  }
}

app.all('/api/reportTheft', ((req, res) => {
  const deviceId = req.query.deviceId
  const userName = req.query.userName
  const log = {
    deviceId: deviceId,
    userName: userName,
    reportTime: new Date()
  }
  logs.push(log)

  const defaultResponse = createDefaultResponse()
  const response = {...defaultResponse, ...log}
  res.send(response)

  fs.writeFile(__dirname + '/logs.json', JSON.stringify(logs), err => {})
}))

app.all('/api/getLogs', ((req, res) => {
  res.send(logs.sort((a, b) => {
    return b.reportTime.getTime() - a.reportTime.getTime()
  }))
}))

app.all('/api/reset', (req, res) => {
  fs.readFile(__dirname + '/logs.default.json', (err, data) => {
    if (!err) {
      logs = JSON.parse(data.toString()).map((it) => {
        return {
          ...it,
          reportTime: new Date(it.reportTime)
        }
      })
    }
  })
  res.send(createDefaultResponse())
})


const server = app.listen(port, () => {
  console.log(`server is running on ${port}`)
})