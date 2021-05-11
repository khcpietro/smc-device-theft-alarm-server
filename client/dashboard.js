/* globals Chart:false, feather:false */

(function () {
  'use strict'

  feather.replace()

  // Graphs
  var ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        '5월 8일',
        '5월 9일',
        '5월 10일',
        '5월 11일',
        '5월 12일',
        '5월 13일',
        '5월 14일'
      ],
      datasets: [{
        data: [
          2,
          1,
          3,
          2,
          4,
          2,
          0
        ],
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
})()