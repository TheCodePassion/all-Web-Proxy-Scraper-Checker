const fs = require('fs')
const request = require('request')

async function testProxy(proxy) {
  return new Promise((resolve) => {
    request(
      {
        url: 'https://httpbin.org/ip',
        method: 'GET',
        proxy: 'http://' + proxy,
        timeout: 1000,
      },
      (err, resp, bdy) => {
        if (!err) {
          console.log(`${proxy} - Alive - ${resp.statusCode}`)
          fs.appendFile('alive.txt', proxy + '\n', (err) => {
            if (err) {
              console.error(`Error writing to alive.txt: ${err}`)
            }
          })
        } else {
          console.log(`${proxy} - Dead`)
        }
        resolve()
      }
    )
  })
}

async function checkProxiesAndSaveGoodOnes() {
  try {
    fs.readFile('resultNotChecked.txt', 'UTF-8', (err, data) => {
      if (err || !data.trim()) {
        fs.writeFile('alive.txt', 'First fetch then check\n', (err) => {
          if (err) {
            console.error(`Error creating alive.txt: ${err}`)
          } else {
            console.log('alive.txt is created successfully.')
            continueMain()
          }
        })
      } else {
        fs.writeFile('alive.txt', '', (err) => {
          if (err) {
            console.error(`Error clearing alive.txt: ${err}`)
          } else {
            console.log('alive.txt is cleared successfully.')
            continueMain()
          }
        })
      }
    })
  } catch (err) {
    console.error(err)
  }
}

async function continueMain() {
  try {
    var proxies_file = await fs.promises.readFile(
      'resultNotChecked.txt',
      'UTF-8'
    )
    const PROXIES = proxies_file.split(/\r?\n/)

    const pLimitModule = await import('p-limit')
    const pLimit = pLimitModule.default(10)

    const promises = PROXIES.map((proxy) => {
      if (proxy.trim()) {
        return pLimit(() => testProxy(proxy.trim()))
      }
    })

    await Promise.all(promises)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { checkProxiesAndSaveGoodOnes }
