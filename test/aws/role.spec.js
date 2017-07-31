const names = require('../../src/aws/names')
const Role = require('../../src/aws/role')

describe('Role', () => {
  it('creates CF resource', () => {
    const r = new Role('', 'my-table-name')
    const j = r.toJSON()

    expect(j).toHaveProperty(names.role('', 'my-table-name'))

    const d = j[names.role('', 'my-table-name')]

    expect(d).toHaveProperty('Type', 'AWS::IAM::Role')
    expect(d).toHaveProperty('Properties.RoleName', 'DynamoDBAutoscaleRolemytablename')
  })

  it('truncates role name if needed', () => {
    const r = new Role('service', 'my-table-name-with-some-extra-long-string-information-added-to-the-end')
    const j = r.toJSON()

    const n = 'serviceDynamoDBAutoscaleRolemyta941c3679150ea9fa409846dd3c00ec13'

    expect(j).toHaveProperty(n)

    const d = j[n]

    expect(d.Properties.RoleName.length).toBe(64)
    expect(d).toHaveProperty('Properties.RoleName', n)
  })
})
