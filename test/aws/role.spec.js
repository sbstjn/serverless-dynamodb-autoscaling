const names = require('../../src/aws/names')
const Role = require('../../src/aws/role')

describe('Role', () => {
  it('creates CF resource', () => {
    const r = new Role('my-table-name')
    const j = r.toJSON()

    expect(j).toHaveProperty(names.role('my-table-name'))

    const d = j[names.role('my-table-name')]

    expect(d).toHaveProperty('Type', 'AWS::IAM::Role')
    expect(d).toHaveProperty('Properties.RoleName', names.role('my-table-name'))
  })
})