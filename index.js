const prepare = (baseUrl, companyName) => {
    const companyBaseUrl = new URL(baseUrl)
    addToPath(companyBaseUrl, `Company('${companyName}')`);
    
    return query

    // Below function will be hoisted
    function query({
        serviceName,
        id,
        top, 
        filter, //: { 
        //     endswith,
        //     startswith,
        //     equals,
        //     contains
        // },
        skip,
        orderBy,
        isDescending,
        isShowCount,
        select
    }) {
        let url = new URL(`${companyBaseUrl.href}`)
        testField('serviceName', serviceName)
        addToPath(url, serviceName)
        // id
        if(id) {
            if(typeof id == "number") {
                url.pathname += `(${id})`
            } 
            else {
                url.pathname += `('${id}')`
            }
        }


        // top
        if(top) {
            console.log('top', top)
           // testField('id', id, undefined)
            addParam(url, '$top', top)
        }

        return url.href
    }
}

function addToPath(url, value) {
    url.pathname += '/' + value
}

function addParam(url, paramKey, paramValue) {
    url.searchParams.append(paramKey, paramValue)
}


// Throw error if the field is not matching our expectations
function testField(label, fieldValue, expectedValue) {
    if(arguments.length === 2) {
        if(!fieldValue) {
            throw new Error(`Field "${label}" must have a value`)
        }
    }

    else if(expectedValue === undefined) {
        if(fieldValue !== undefined) {
            throw Error(`Field "${label}" must NOT have a value`)
        }
    }

    // We stringify so our check works for objects as well
    else {
        if(JSON.stringify(fieldValue) !== JSON.stringify(expectedValue)) {
            throw Error(`Field "${label}" must equal ${expectedValue} but was ${fieldValue}`)
        }
    }
}



module.exports = prepare