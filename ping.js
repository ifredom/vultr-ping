const http = require('http')
const https = require('https')
const Promise = require('bluebird')
const chalk = require('chalk')
const dns = require('dns')
const dataJSON = require('./data')
const rrtype = 'A'

function ping(domain = '', port = '') {
  const promise = new Promise((resolve, reject) => {
    const useHttps = domain.indexOf('https') === 0
    const mod = useHttps ? https.request : http.request
    const outPort = port || (useHttps ? 443 : 80)
    const baseUrl = domain.replace('http://', '').replace('https://', '')
    const options = {
      host: baseUrl,
      port: outPort,
      path: '/'
    }
    const start = Date.now()

    const pingRequest = mod(options, () => {
      resolve(Date.now() - start)
      pingRequest.abort()
    })

    pingRequest.on('error', () => {
      reject(-1)
      pingRequest.abort()
    })

    pingRequest.write('')
    pingRequest.end()
  })
  return promise
}


for (let index = 0; index < dataJSON.length; index++) {
  dnsResolved(dataJSON[index])
}


function dnsResolved(data) {

  var result = ping(data.domain).then(time => {

    // console.log(
    //   chalk.green(`响应时间:${time}/ms\n`)
    // );
    dns.resolve(data.domain, rrtype, (err, records) => {
      console.log(
        chalk.cyan(`位置:${data.title}`),
        chalk.gray(`IP:${records}`),
        chalk.green(`响应时间:${time}/ms\n`)
      );
    })

  })
}