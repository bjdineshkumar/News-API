const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');
const app = express()

const newspapers = [ 
    {
        name : 'thetimes',
        address : 'https://www.thetimes.co.uk/topic/health'
    },
    {
        name : 'globalnews',
        address : 'https://globalnews.ca/tag/coronavirus/'
    },
    {
        name : 'guardian',
        address: 'https://www.theguardian.com/world/coronavirus-outbreak'
    }
 ]
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Covid")' , html).each(function () {
                const title = $(this).text().replace(/\t/g, '').replace(/\n/g, '')
                const url = $(this).attr('href')

        
                
                articles.push({
                    title,
                    url,
                    source: newspaper.name
                })
            })

            $('a:contains("COVID-19")', html).each(function () {
                const title = $(this).text().replace(/\t/g, '').replace(/\n/g, '')
                const url = $(this).attr('href')
                
                articles.push({
                    title,
                    url,
                    source: newspaper.name
                })
            })


        })
})


app.get('/', (req,res) => {
    res.send("<h1> Welcome to the News API :  </h1> <h3> 1: Currently Supporting news related to covid </h3> <p> Examples : </p>" 
            + "<p>&nbsp;&nbsp;&nbsp;1.<b>/news/covid :</b> For Covid related news from all websites</p> <p>&nbsp;&nbsp;&nbsp;2.<b>/news/covid/News-Name :</b> For Covid related news from specific news website</p>")

})

app.get('/news/covid', (req,res) => {

    res.json(articles)
})

app.get('/news/covid/:newspapername', (req,res) => {

    
    const newspapername = req.params.newspapername
    const newspaperAddress = newspapers.filter(newspaperAddress => newspaperAddress.name == newspapername)[0].address

    console.log(newspaperAddress)

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Covid")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                console.log(url)
                specificArticles.push({
                    title,
                    url: url,
                    source: newspapername
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
