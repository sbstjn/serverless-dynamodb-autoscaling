const names = require('../../src/aws/names')
const Role = require('../../src/aws/role')

describe('Role', () => {
  it('creates CF resource', () => {
    const r = new Role('my-table-name')
    const j = r.toJSON()

    expect(j).toHaveProperty(names.role('my-table-name'))

    const d = j[names.role('my-table-name')]

    expect(d).toHaveProperty('Type', 'AWS::IAM::Role')
    expect(d).toHaveProperty('Properties.RoleName', 'DynamoDBAutoscaleRolemytablename')
  })

  it('truncates role name if needed', () => {
    const r = new Role('my-table-name-with-some-extra-long-string-information-added-to-the-end')
    const j = r.toJSON()

    expect(j).toHaveProperty(names.role('my-table-name-with-some-extra-long-string-information-added-to-the-end'))

    const d = j[names.role('my-table-name-with-some-extra-long-string-information-added-to-the-end')]

    expect(d.Properties.RoleName.length).toBeLessThan(65)
    expect(d).toHaveProperty('Properties.RoleName', '0cde19b63d7d9f9b35cd41a979fd72a2')
  })
})
