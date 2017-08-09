import Role from '../../src/aws/role'

describe('Role', () => {
  it('creates CF resource', () => {
    const r = new Role({
      index: 'index',
      region: 'region',
      service: 'service',
      stage: 'stage',
      table: 'MyTableResource'
    })

    const j = r.toJSON()

    expect(j).toHaveProperty('serviceDynamoDBAutoscaleRoleMyTableResourceIndexStageRegion')
  })

  it('truncates role name if needed', () => {
    const r = new Role({
      index: 'index',
      region: 'region',
      service: 'service-with-a-long-name-to-force-truncation',
      stage: 'stage',
      table: 'MyTableResource'
    })

    const j = r.toJSON()

    expect(j).toHaveProperty('servicewithalongnametoforcetrunc81d5364e64588e2b095c450722c20a24')
  })
})
