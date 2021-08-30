const prepare = ({ baseUrl, companyName }) => {
    const companyBaseUrl = `${baseUrl}/Company('${companyName}')`
    return query

    // Below function will be hoisted
    function query({
        serviceName,
        id,
        top, 
        filter: { 
            endswith,
            startswith,
            equals,
            contains
        },
        skip,
        orderBy,
        isDescending,
        isShowCount,
        select
    }) {

    }
}




module.exports = {
    prepare
}