## Odata ##

# Introduction #
Odata is a protocol for creating and consuming REST Apis. In Microsoft Dynamics NAV and Microsoft Dynamics 365 Business Central (BC), OData is one of two alternative options (the other is SOAP) of exposing data in an ERP database to the outside world as a web service.

Odata APIs accept either XML (application/atom+xml) or JSON (application/json) for responses. The most recent version of Odata, OdataV4, is mostly consumed as JSON.

The role of this package is to provide an easy and declarative way of describing and therefore creating the URL that should be used when making a request to the NAV / BC web server.

# Initialization - `prepare`

Before you can create a request URL, you must do an initialization step. You prepare the query that will be used to generate URLs for a specific NAV server and company. This is done as follows

````javascript
const baseUrl = 'http:http://junit:7148/BC140/ODataV4'
const companyName = 'AVSI Kampala'
const query = prepare(baseUrl, companyName)
````

Once that's done, you can go ahead to create URLs using the `query` function returned by `prepare`.


# Creating URLs - `query` #
The `query` function produced by `prepare` accepts an object that details the kind of URL you want to create. 

Here is an example:
````javascript
const serviceName = 'MyTimesheetList'
const url = query({ serviceName })
// url: http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24format=json
````

Here is another example:
````javascript
const url = query({
    serviceName,
    orderby: {
        property: 'Project',
        isDescending: true
    }
})
// url: http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24orderby=Project+desc&%24format=json
                
````

Third example

````javascript
const url = query({
    serviceName,
    filter: {
        property: 'Description',
        startswith: 'Did '
    }
})
// url: http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24filter=startswith%28Description%2C%27Did+%27%29&%24format=json       
````
Below is an object with all available properties for the object passed to `query`.
````javascript
const queryOptions = {
    serviceName,
    id, // get resource by id
    count, // boolean, whether to include the number of items 
    top, // number, how many items to return
    skip, // number, how many items to skip
    filter, //  object, has 2 properties: property, and one of: endswith, startswith, equals, contains
    orderby, // object, has 2 properties: property, isDescending
    select, // list, specify which properties to include per item
    disableJson // boolean, whether to remove the json format query param
}
````
 When `id` is present, properties that apply to a collection such as `top`, `orderby` etc should not be used.