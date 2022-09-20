const csvToJson = require('csvtojson')
const fs = require('fs')
const csvFilePath = "candidates.csv"


csvToJson().fromFile(csvFilePath).then((json) => {
    console.log(json)
    fs.writeFileSync('output.json', JSON.stringify(json, null, 4), 'utf-8', (err) => {
        if(err) console.log(err)
    })
})