const httpntlm = require('httpntlm')


// Send a request to NAV using NTLM authentication.
// Relies on values stored in environmental variables.
async function sendNtlmRequest({ 
    method, url, json, body, username, password, domain 
}, requestCallback) {
    const options = { 
        headers: {
            'Content-Type': 'application/json'
        },
        url, 
        username, 
        password,
        domain,
        json, // optional (this will be the object itself that can be parsed)
        body  // optional (this will be got by JSON.stringify)
    }
    try {
        const result = await new Promise((resolve, reject) => {
            httpntlm[method](options, (err, res) => {
                if(err) {
                    reject(err)
                }
                resolve(res)
            })
        })
        
        const response = {}     
        const statusCode = result.statusCode   
        response.statusCode = result.statusCode

        if(statusCode >= 200 && statusCode < 300) {
            response.data = JSON.parse(result.body)            
        }

        else if(result.statusCode === 401) {
            console.error(`Authentication failed: username: ${USERNAME}, password: ${PASSWORD}, domain: ${DOMAIN}`)
            response.statusMessage ='Windows Authentication failed'
        }
        else {
            console.log(result)
            response.statusMessage = result.body
        }
        requestCallback(null, response)
    } catch(err) {
        // console.log('failed', err)
        requestCallback(err)
    }
}

function initialize({ username, password, domain }) {
    return request;
    
    async function request({ method, url, json, body }, responseCallback){
        const options = {
            method: method.toLowerCase(), // httpntlm uses lowercase methods
            url, username, password, domain, json, body
        }
        sendNtlmRequest(options, (err, data) => {
            if(err) {
                responseCallback(err)
            } else {
                responseCallback(null, data)
            }
        })
    }    
}



module.exports = {
    initialize
}