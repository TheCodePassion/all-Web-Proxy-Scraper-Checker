const fs = require('fs')
const fetch = require('node-fetch')

async function parseProxiesFromLinks(URLs) {
  const fetchHTML = async (url) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      return await response.text()
    } catch (error) {
      console.error('Error: ', error)
      return null
    }
  }

  const regex = /\b(?:\d{1,3}\.){3}\d{1,3}:\d+\b/g
  const uniqueMatches = new Set()
  const errorLinks = []

  try {
    const htmlArray = await Promise.all(URLs.map((url) => fetchHTML(url)))

    htmlArray.forEach((html, index) => {
      try {
        if (html === null) {
          errorLinks.push(URLs[index])
          return
        }

        const matches = html.match(regex)
        if (matches) {
          matches.forEach((match) => uniqueMatches.add(match))
        } else {
          errorLinks.push(URLs[index])
        }
      } catch (error) {
        console.error('Error:', error)
        errorLinks.push(URLs[index])
      }
    })

    const result = Array.from(uniqueMatches).join('\n')

    fs.writeFile('resultNotChecked.txt', result, (err) => {
      if (err) {
        console.error('Error writing file:', err)
      } else {
        console.log('File "resultNotChecked.txt" has been saved successfully.')
      }
    })

    if (errorLinks.length > 0) {
      const errorContent =
        errorLinks.join('\n') + ' No matches found or network error\n'

      fs.writeFile('errorGetProxyLinks.txt', errorContent, (err) => {
        if (err) {
          console.error('Error writing file:', err)
        } else {
          console.log(
            'File "errorGetProxyLinks.txt" has been saved successfully.'
          )
        }
      })
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

module.exports = {
  parseProxiesFromLinks,
}
