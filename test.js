const prepare = require('./index')
 
describe('prepare', () => {
    const baseUrl = 'http://junit:7148/BC140/ODataV4'
    const companyName = 'AVSI Kampala'
    const serviceName = 'MyTimesheetList'
    const top = 3

    const query = prepare(baseUrl, companyName)

    describe('query', () => {

        it('serviceName', () => {            
            const url = query({
                serviceName
            })
            const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList"
            expect(url).toBe(expectedUrl)
        })

        describe('id', () => {

            it('id number', () => {
                const id = 36
                const url = query({
                    serviceName,
                    id
                })
                const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList(36)"
                expect(url).toBe(expectedUrl)
            })

            it('id string', () => {
                const id = "A002"
                const url = query({
                    serviceName,
                    id
                })
                const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList('A002')"
                expect(url).toBe(expectedUrl)
            })
        })

        it('top', () => {
            const url = query({
                serviceName,
                top: 3
            })
            const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24top=3"
            expect(url).toBe(expectedUrl)
        })

        it('skip', () => {
            const url = query({
                serviceName,
                skip: 2
            })
            const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24skip=2"
            expect(url).toBe(expectedUrl)
        })

        describe('orderby', () => {
            it('orderby ascending', () => {
                const url = query({
                    serviceName,
                    orderby: {
                        property: 'Project'
                    }
                })
                const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24orderby=Project"
                expect(url).toBe(expectedUrl)
            })
            it('orderby descending', () => {
                const url = query({
                    serviceName,
                    orderby: {
                        property: 'Project',
                        isDescending: true
                    }
                })
                const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24orderby=Project+desc"
                expect(url).toBe(expectedUrl)
            })
        })

        it('count', () => {
            const url = query({
                serviceName,
                count: true
            })
            const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24count=true"
            expect(url).toBe(expectedUrl)
        })

        it('select', () => {
            const url = query({
                serviceName,
                select: [ 'Donor', 'Description', 'LineNo' ]
            })
            const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24select=Donor%2CDescription%2CLineNo"
            expect(url).toBe(expectedUrl) 
        })

        describe('filter', () => {
            it('contains', () => {
                const url = query({
                    serviceName,
                    filter: {
                        property: 'Donor',
                        contains: 'deago'
                    }
                })
                const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24filter=contains%28Donor%2C%27deago%27%29"
                expect(url).toBe(expectedUrl) 
            })
            describe('equals', () => {
                it('equals number', () => {
                    const url = query({
                        serviceName,
                        filter: {
                            property: 'Donor',
                            equals: 'deago'
                        }
                    })
                    const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24filter=Donor+eq+%27deago%27"
                    expect(url).toBe(expectedUrl) 
                })

                it('equals string', () => {
                    const url = query({
                        serviceName,
                        filter: {
                            property: 'Time',
                            equals: 1
                        }
                    })
                    const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24filter=Time+eq+1"
                    expect(url).toBe(expectedUrl) 
                })
            })
            it('endswith', () => {
                const url = query({
                    serviceName,
                    filter: {
                        property: 'Description',
                        endswith: 'ing'
                    }
                })
                const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24filter=endswith%28Description%2C%27ing%27%29"
                expect(url).toBe(expectedUrl) 
            })
            it('startswith', () => {
                const url = query({
                    serviceName,
                    filter: {
                        property: 'Description',
                        startswith: 'Did '
                    }
                })
                const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24filter=startswith%28Description%2C%27Did+%27%29"
                expect(url).toBe(expectedUrl) 
            })
            
        })

    })
})