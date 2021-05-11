import express from 'express'
import path from 'path'

const app = express()
let port = 3000
const __dirname = path.resolve(path.dirname(''))

let logs = []

function createDefaultResponse() {
    return {
        "responseCode": 200,
        "message": ""
    }
}

app.all('/client', ((req, res) => {
    res.sendFile(__dirname + '/client/index.html')
}))

app.all('/client/:fileName', ((req, res) => {
    let fileName = req.params.fileName
    res.sendFile(__dirname + '/client/' + fileName)
}))

app.all('/api/reportTheft', ((req, res) => {
    const deviceId = req.query.deviceId
    const log = {
        deviceId: deviceId,
        reportTime: new Date()
    }
    logs.push(log)

    const defaultResponse = createDefaultResponse()
    const response = { ...defaultResponse, ...log }
    res.send(response)
}))

app.all('/api/getLogs', ((req, res) => {
    res.send(logs)
}))


const server = app.listen(port, () => {
    console.log(`server is running on ${port}`)
})