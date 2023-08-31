const URLS = require('./URLs')
const { parseProxiesFromLinks } = require('./webscraper')
const { checkProxiesAndSaveGoodOnes } = require('./proxychecer.js')
const { processFile } = require('./fileProcessor')

async function main() {
  try {
    await parseProxiesFromLinks(URLS)
    await checkProxiesAndSaveGoodOnes()
  } catch (error) {
    console.error(error)
  }
}

main()
