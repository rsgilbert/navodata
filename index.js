const prepare = (baseUrl, companyName) => {
    const companyBaseUrl = new URL(baseUrl)
    // We add the company as a query param
    // instead of using (Company('MyNiceCompany')) 
    // because old versions of NAV eg NAV 2015 give an error
    // about missing company information when you make PATCH 
    // requests using the Company('MyNiceCompany') approach
    addParam(companyBaseUrl, 'company', companyName)
    
    return query

    // Below function will be hoisted
    function query({
        serviceName,
        id,
        count,
        top, 
        skip,
        // filter is an object / array. If object, it has properties: property, and one of these: endswith, startswith, equals, contains
        filter, 
        orderby,
        select,
        // For Odata V4 (> MS Dynamics 2018)
        boundedAction,
        disableJson
    }) {
        // --> joi
        let url = new URL(`${companyBaseUrl.href}`)
        testField('serviceName', serviceName)
        addToPath(url, serviceName)
        // id
        if(id) {
            if(typeof id == "number") {
                url.pathname += `(${id})`
            } 
            else if(typeof id == "object") {
                // We are specifying multiple keys
                let idParts = Object.entries(id).map(([k,v]) => {
                    if(typeof v === 'number') {
                        return `${k}=${v}`
                    } else {
                        // assume v is a string
                        return `${k}='${v}'`
                    }
                })
                const idPart = `(${idParts.join(',')})`
                url.pathname += idPart
            }
            else {
                url.pathname += `('${id}')`
            }
        }

        // count
        if(count) {
            testField('id', id, undefined)
            addParam(url, '$count', 'true')
        }

        // top
        if(top) {
            testField('id', id, undefined)
            addParam(url, '$top', top)
        }

        // skip
        if(skip) {
            testField('id', id, undefined)
            addParam(url, '$skip', skip)
        }

        // orderby
        if(orderby) {
            testField('id', id, undefined)
            let orderbyParamValue = orderby.property
            if(orderby.isDescending) {
                orderbyParamValue += ' desc'
            } 
            addParam(url, '$orderby', orderbyParamValue)
        }

        // select
        if(select) {
            testField('id', id, undefined)
            const selectParamValue = select.join(',')
            addParam(url, '$select', selectParamValue)
        }

        // filter
        if(filter) {
            if(filter instanceof Array) {
                let filters = filter.map(f => {
                    return getFilterParamValue(f)
                })
                const paramValue = filters.join(' and ')
                addParam(url, '$filter', paramValue)
            }
            else {
                addParam(url, '$filter', getFilterParamValue(filter))            
            }
        }

        // boundedAction
        // Note that this applies to OData V4 and above.
        // Version of NAV earlier than NAV 2018 use older Odata versions that do not support exposing 
        // functions as external services
        // Also, the action is not application to a collection. In our
        // case, an id parameter should also be provided to identify the resource.
        // Its a good thing we have this requirement of providing an id, it prevents us
        // from accidentally inserting a new record when we forget to specify a boundAction value
        // Also note that boundedActions begin with: "NAV." eg NAV.PerformPost
        // Moreover, in the json for the request body, ensure all your keys begin with a small letter, eg
        // use { requestId: 52 } and not { RequestId: 52 } lest you get a BadRequest error.
        if(boundedAction) {
            addToPath(url, boundedAction)
        }

        // json support
        // if you donot want to use json, and the web service eg for old NAV versions like NAV 2015
        // supports or defaults to xml, set property -> disableJson: true
        if(!disableJson) {
            addParam(url, '$format', 'json')
        }
        return url.href
    }
}

function getFilterParamValue(filter) {
    if(filter.contains) {
        const containsParamValue = `contains(${filter.property},'${filter.contains}')`
        return containsParamValue
    }
    if(filter.equals) {
        let equalsParamValue
        if(typeof filter.equals === 'number' || typeof filter.equals === 'boolean') {
            equalsParamValue = `${filter.property} eq ${filter.equals}`
        }
        else {
            equalsParamValue = `${filter.property} eq '${filter.equals}'`
        }
        return equalsParamValue
    }
    if(filter.endswith) {
        const endswithParamValue = `endswith(${filter.property},'${filter.endswith}')`
        return endswithParamValue
    }
    if(filter.startswith) {
        const startswithParamValue = `startswith(${filter.property},'${filter.startswith}')`
        return startswithParamValue
    }
    throw Error('Unknown filter: ' + filter)
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