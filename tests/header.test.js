//writing test using Jest
// This file is aimed to the test specifically the Header
const Page = require('./helpers/page')

let page;
//before each test start a browser and a page
beforeEach(async ()=>{
    page= await Page.build() //calling the static function
    await page.goto('http://localhost:3000')
})

// close the browser after the test colpleted
afterEach(async()=>{
    await page.close()
})

test('The header has the correct text',async ()=>{
    // getting and DOM elemtn to test its conten 
    const text = await page.getContentOf('a.brand-logo')
    expect(text).toEqual('Blogster')
})

test('clicking login starts oauth flows',async()=>{
    await page.click('.right a')
    const url = await page.url()
    expect(url).toMatch(/accounts\.google\.com/)
})

test('When signed in, show logout button', async()=>{
    //first we login
    await page.login()
    const text = await page.getContentOf('.right > li:nth-child(2n)> a')
    //check that there's the logut button means we are loggedin 
    expect(text).toEqual('Logout')
})





