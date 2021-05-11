import express from 'express'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

const app = express()
let port = 3000
const __dirname = path.resolve(path.dirname(''))

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

app.all('/client', ((req, res) => {
  res.sendFile(__dirname + '/client/index.html')
}))

app.all('/client/:fileName', ((req, res) => {
  let fileName = req.params.fileName
  let contentType = mime.lookup(fileName)
  if (!contentType) {
    contentType = 'application/octet-stream'
  }

  res.setHeader('Content-Type', contentType)
  res.sendFile(__dirname + '/client/' + fileName)
}))

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


const server = app.listen(port, () => {
  console.log(`server is running on ${port}`)
})