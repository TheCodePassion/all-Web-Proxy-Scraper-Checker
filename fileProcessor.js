const fs = require('fs')

function processFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const proxyList = data.trim().split('\n')
    const httpProxies = []
    const socks5Proxies = []
    const socks4Proxies = []

    proxyList.forEach((proxy) => {
      const [ip, port] = proxy.split(':')

      if (port && Number(port) && Number(port) >= 1 && Number(port) <= 65535) {
        if (ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
          if (port.startsWith('8')) {
            socks4Proxies.push(proxy)
          } else if (port.startsWith('9')) {
            socks5Proxies.push(proxy)
          } else {
            httpProxies.push(proxy)
          }
        }
      }
    })

    fs.writeFile('httpUnChecked.txt', httpProxies.join('\n'), (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('HTTP Proxies have been written to httpUnChecked.txt')
    })

    fs.writeFile('socks4UnChecked.txt', socks4Proxies.join('\n'), (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('SOCKS4 Proxies have been written to socks4UnChecked.txt')
    })

    fs.writeFile('socks5UnChecked.txt', socks5Proxies.join('\n'), (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('SOCKS5 Proxies have been written to socks5UnChecked.txt')
    })
  })
}

module.exports = { processFile }
