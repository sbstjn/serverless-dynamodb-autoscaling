import Target from '../../src/aws/target'

describe('Target', () => {
  it('creates CF resource for read capacity', () => {
    const t = new Target({
      index: 'index',
      region: 'region',
      service: 'service',
      stage: 'stage',
      table: 'MyTableResource'
    }, true, 10, 100)

    const j = t.toJSON()

    expect(j).toHaveProperty('serviceAutoScalingTargetReadMyTableResourceIndexStageRegion')

    const d = j.serviceAutoScalingTargetReadMyTableResourceIndexStageRegion

    expect(d).toHaveProperty('Properties.MinCapacity', 10)
    expect(d).toHaveProperty('Properties.MaxCapacity', 100)
  })

  it('creates CF resource for false capacity', () => {
    const t = new Target({
      index: 'index',
      region: 'region',
      service: 'service',
      stage: 'stage',
      table: 'MyTableResource'
    }, false, 10, 100)

    expect(t.toJSON()).toHaveProperty('serviceAutoScalingTargetWriteMyTableResourceIndexStageRegion')
  })
})
