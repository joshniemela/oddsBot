import puppeteer from 'puppeteer'
import process from 'node:process'
import fs from 'node:fs'


let COOKIES_EXIST: boolean = false
let cookies: puppeteer.Protocol.Network.CookieParam[] | undefined

if (fs.existsSync('cookies.json')) {
    cookies = JSON.parse(fs.readFileSync('cookies.json', { encoding: 'utf8' })) as puppeteer.Protocol.Network.CookieParam[]
    for (const c of cookies) {
        if (c.name === "access_token") {
            if (c.expires !== undefined && c.expires > (Date.now() / 1000)) {
                COOKIES_EXIST = true
            } else {
                console.log("Cookies expired")
            }
            break
        }
    }
}



; (async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    if (COOKIES_EXIST && cookies !== undefined) {
        await page.setCookie(...cookies)
        await page.goto('https://oddsjam.com/betting-tools/arbitrage', { waitUntil: 'domcontentloaded' })
        const dataResponse = await page.waitForResponse(
            response =>
                response.url().startsWith('https://oddsjam.com/api/backend/arbitrage?') && response.status() === 200
        )
        await fs.promises.writeFile('data.json', JSON.stringify(await dataResponse.json(), null, ' '))
        await browser.close()
    } else {
        if (process.env.ODDS_EMAIL === undefined) {
            await browser.close()
            throw new Error("ODDS_EMAIL not set")
        }
        await page.goto('https://oddsjam.com/auth/login', { waitUntil: 'domcontentloaded' })
        await page.type('#login-email', process.env.ODDS_EMAIL)
        let loginSelector = String.raw`#__next > div > main > div > div.mt-8.sm\:mx-auto.sm\:w-full.sm\:max-w-md > div > div > form > button`
        await page.waitForSelector(loginSelector)
        await page.click(loginSelector)
        await page.waitForNavigation({ timeout: 0 })
        let cookies = await page.cookies()
        await fs.promises.writeFile('cookies.json', JSON.stringify(cookies))
        await browser.close()
        console.log("Saved cookies")
    }
})()
