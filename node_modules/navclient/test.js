const { initialize } = require('./index')

const authOptions = {
    username: 'GilbertS',
    password: ' ',
    domain: 'JUNIT'
}

const request = initialize(authOptions)

const requestOptions = {
    method: 'POST',
    url: "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList",
    // json: {
    //     Description: "Greetings"
    // },
    body : JSON.stringify({
        Description: 'Milkshake'
    })
}

request(requestOptions, (err, data) => {
    if(err) {
        return console.log(err)
    } 
    console.log(JSON.stringify(data))
})






