
const Page = require('./helpers/page')

let page;

beforeEach(async ()=>{
    page= await Page.build()
    await page.goto('http://localhost:3000')
})


afterEach(async()=>{
    await page.close()
})



describe('When logged id ', async ()=>{
    beforeEach(async ()=>{
        await page.login()
        await page.click('.fixed-action-btn >a')
    })
    
    test('can see the create blog form ', async ()=>{
        const text = await page.getContentOf('.title label')
        expect(text).toEqual('Blog Title')
    })
    
    describe('And using valid inputs', async()=> {
        beforeEach(async ()=>{
            await page.type('.title input', ' My Title')
            await page.type('.content input', ' My Contents')
        })
        
        test('Submitting takes to review screen', async ()=> {
            await page.click('.teal')
            const title = await page.getContentOf('form h5')
            expect(title).toEqual('Please confirm your entries')
        })
        
        test('Submitting and save blogs to index page', async ()=>{
            await page.click('.green')
            await page.waitFor('.card')
            const title= await page.getContentOf('.card-title')
            const content = await page.getContentOf('p')
            expect(title).toEqual('My Title')
            expect(content).toEqual('My Contents')
        })
    })
    
    describe('And using a invalid inputs ', async ()=>{
        beforeEach(async ()=>{
            //simulate submitting an empty form
            await page.click('form button');
        })

        test('the form shows an error message',async()=>{
            const titleError= await page.getContentOf('.title .red-text') 
            const contentError = await page.getContentOf('.content .red-text')
            expect(titleError).toEqual('You must provide a value') 
            expect(contentError).toEqual('You must provide a value')   
        })
    })
})

describe('User in not logged in ', async()=>{
    test('User cannot create blog posts ', async ()=>{
        const result= await page.evaluate(
            // fetch is globally defined function available since es2015 
            ()=>{
                return fetch('/api/blogs', {
                    method:'POST',
                    credentials:'same-origin',
                    headers: {
                        'Content-Type':'applicattion/json'
                    },
                    body: JSON.stringify({title:'My title', content:'My titlle'})
                }).then(res =>res.json());
            }
        )
    expect(result.error).toEqual('You must log in!')
    })
    test('User cannot get lists of posts ', async()=>{
        const result= await page.evaluate(
            // fetch is globally defined function available since es2015 
            ()=>{
                return fetch('/api/blogs', {
                    method:'GET',
                    credentials:'same-origin',
                    headers: {
                        'Content-Type':'applicattion/json'
                    }
                }).then(res =>res.json());    
            }
        )
    expect(result).toEqual({error:'You must log in!'})
    })
})


















