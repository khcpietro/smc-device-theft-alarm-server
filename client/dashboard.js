/* globals Chart:false, feather:false */

(function () {
  'use strict'

  feather.replace()

  function loadData() {
    return window.fetch('/api/getLogs')
      .then(res => res.json())
      .then(logs => {
        return logs.map(log => {
          return {
            ...log,
            reportTime: new Date(log.reportTime)
          }
        })
      })
      .then(logs => {
      return logs.sort((a, b) => {
          return b.reportTime.getTime() - a.reportTime.getTime()
        })
      })
      .then(logs => {
        const logTableBody = document.getElementById('report-logs')
        let logElements = ''

        const graphData = {}
        const days = [...new Set(logs.map(log => log.reportTime.toLocaleDateString()))]
        days.forEach(day => {
          graphData[day] = logs.filter(log => {
            return log.reportTime.toLocaleDateString() === day
          })
        })

        chart.data.labels = []
        chart.data.datasets.forEach(dataset => {
          dataset.data = []
        })
        days.reverse().forEach(day => {
          chart.data.labels.push(day);
          chart.data.datasets.forEach((dataset) => {
            dataset.data.push(graphData[day].length);
          });
        })
        chart.update();

        logs.forEach(log => {
          const userName = log.userName
          const logTime = log.reportTime.toLocaleString('ko-KR')
          const newAlert = new Date().getTime() - log.reportTime.getTime() < 3600 * 1000
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0000" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">\n' +
            '    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>\n' +
            '  </svg>'
            : ''

          logElements +=
            `<tr>\n` +
            `    <td>${newAlert}</td>\n` +
            `    <td>${log.deviceId}</td>\n` +
            `    <td>${userName}</td>\n` +
            `    <td>${logTime}</td>\n` +
            `</tr>`
        })
        logTableBody.innerHTML = logElements
      })
  }

  // Graphs
  var ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        data: [],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 1
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })

  loadData()
  setInterval(() => {
    loadData()
  }, 1000)
})()