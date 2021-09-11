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
        // filter is an object with properties: property, and one of these: endswith, startswith, equals, contains
        filter, 
        orderby,
        select,
        // For Odata V4 (> MS Dynamics 2018)
        boundedAction,
        disableJson
    }) {
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
            testField('id', id, undefined)
            if(filter.contains) {
                // Note: this filter applies only to strings (Edm.String)
                testField('filter.endswith', filter.endswith, undefined)
                testField('filter.equals', filter.equals, undefined)
                testField('filter.startswith', filter.startswith, undefined)
                const containsParamValue = `contains(${filter.property},'${filter.contains}')`
                addParam(url, '$filter', containsParamValue)
            }
            if(filter.equals) {
                // Note: this filter applies to both strings (Edm.String) and numbers 
                testField('filter.endswith', filter.endswith, undefined)
                testField('filter.contains', filter.contains, undefined)
                testField('filter.startswith', filter.startswith, undefined)
                let equalsParamValue
                if(typeof filter.equals === 'number') {
                    equalsParamValue = `${filter.property} eq ${filter.equals}`
                }
                else {
                    equalsParamValue = `${filter.property} eq '${filter.equals}'`
                }
                addParam(url, '$filter', equalsParamValue)
            }
            if(filter.endswith) {
                // Note: this filter applies only to strings (Edm.String)
                testField('filter.contains', filter.contains, undefined)
                testField('filter.equals', filter.equals, undefined)
                testField('filter.startswith', filter.startswith, undefined)
                const endswithParamValue = `endswith(${filter.property},'${filter.endswith}')`
                addParam(url, '$filter', endswithParamValue)
            }
            if(filter.startswith) {
                // Note: this filter applies only to strings (Edm.String)
                testField('filter.contains', filter.contains, undefined)
                testField('filter.equals', filter.equals, undefined)
                testField('filter.endswith', filter.endswith, undefined)
                const startswithParamValue = `startswith(${filter.property},'${filter.startswith}')`
                addParam(url, '$filter', startswithParamValue)
            }
        }

        // boundedAction
        // Note that this applies to OData V4 and above.
        // Version of NAV earlier than NAV 2018 use older Odata versions that do not support exposing 
        // functions as external services
        // Also, the action is not application to a collection. In our
        // case, an id parameter should also be provided to identify the resource.
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