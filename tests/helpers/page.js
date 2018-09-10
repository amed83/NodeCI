const puppeteer = require('puppeteer')
const sessionFactory = require('../factories/sessionFactory')
const userFactory =require('../factories/userFactory')

class CustomPage{
    static async build(){
        const browser= await puppeteer.launch({
            headless:true,
            args:['--no-sandbox'] //settings for Trevis CI 
        })
        const page = await browser.newPage()
        const customPage = new CustomPage(page)
        
        return new Proxy(customPage,{
            get:function(target,property){
                return customPage[property] ||browser[property] || page[property]
            }
        })
        
    }
    constructor(page){
        this.page=page
    }
    
    async login(){
        //create an user with userFactory
        const user = await userFactory()
        //this is need to create the fake object
        const {session,signature} = sessionFactory(user)
        //set new cookie on our page 
        //session
        await this.page.setCookie({name:'session', value:session})
        //and signature
        await this.page.setCookie({name:'session.sig', value:signature })
        //refresh the this.page
        await this.page.goto('http://localhost:3000/blogs')
        //wait for this element to be visible before evauateit 
        await this.page.waitFor('.right > li:nth-child(2n)> a')
        
    }
    // function to use everytime we need to retrun a content from a selector
    async getContentOf(selector) {
        return this.page.$eval(selector,el=>el.innerHTML)
    }
}


module.exports=CustomPage