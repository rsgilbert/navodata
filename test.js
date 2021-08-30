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
                top: 3,
              //  id: 1
            })
            const expectedUrl = "http://junit:7148/BC140/ODataV4/Company('AVSI%20Kampala')/MyTimesheetList?%24top=3"
            expect(url).toBe(expectedUrl)
        })

        
    })
})