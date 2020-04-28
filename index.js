const express = require('express')
const puppeteer = require('puppeteer')
const fetch = null
const app = express()

app.get('/image', async (req, res) => {
  // puppeteer.launch() => Chrome running locally (on the same hardware)
  let browser = null

  try {
    const email = process.env.SLACK_USER
    const password = process.env.SLACK_PASS

    browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto('https://usdrcovid19.slack.com/admin')
    await page.waitFor('#email')

    const inviteElem = 'button[data-qa="admin_invite_people_btn"]'
    await page.$('#email').then((emailElement) => emailElement.type(email))
    await page.$('#password').then((passwordElement) => passwordElement.type(password))
    await page.$('#signin_btn').then((button) => button.click())
    await page.waitFor(inviteElem)
    await page.$(inviteElem).then((button) => button.click())
    await page.waitFor(1000)
    // invite_modal_email_0
    // invite_modal_name_0
    const screenshot = await page.screenshot()

    res.end(screenshot, 'binary')
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).send(error.message)
    }
  } finally {
    if (browser) {
      browser.close()
    }
  }
})

app.listen(8080, () => console.log('Listening on PORT: 8080'))
