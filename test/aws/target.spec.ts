import * as names from '../../src/aws/names'
import Target from '../../src/aws/target'

describe('Target', () => {
  it('creates CF resource for read capacity', () => {
    const t = new Target('', 'my-table-name', 4, 100, true)
    const j = t.toJSON()

    expect(j).toHaveProperty(names.target('', 'my-table-name', true))

    const d = j[names.target('', 'my-table-name', true)]

    expect(d).toHaveProperty('Type', 'AWS::ApplicationAutoScaling::ScalableTarget')
    expect(d).toHaveProperty('Properties.MinCapacity', 4)
    expect(d).toHaveProperty('Properties.MaxCapacity', 100)
    expect(d).toHaveProperty('Properties.ScalableDimension', names.dimension(true))
    expect(d).toHaveProperty('Properties.ServiceNamespace', 'dynamodb')
    expect(d).toHaveProperty('Properties.RoleARN.Fn::GetAtt')
    expect(d).toHaveProperty('Properties.RoleARN.Fn::GetAtt', [ names.role('', 'my-table-name'), 'Arn' ])
  })

  it('creates CF resource for write capacity', () => {
    const t = new Target('', 'my-table-name', 100, 2000, false)
    const j = t.toJSON()

    expect(j).toHaveProperty(names.target('', 'my-table-name', false))

    const d = j[names.target('', 'my-table-name', false)]

    expect(d).toHaveProperty('Type', 'AWS::ApplicationAutoScaling::ScalableTarget')
    expect(d).toHaveProperty('Properties.MinCapacity', 100)
    expect(d).toHaveProperty('Properties.MaxCapacity', 2000)
    expect(d).toHaveProperty('Properties.ScalableDimension', names.dimension(false))
    expect(d).toHaveProperty('Properties.ServiceNamespace', 'dynamodb')
    expect(d).toHaveProperty('Properties.RoleARN.Fn::GetAtt')
    expect(d).toHaveProperty('Properties.RoleARN.Fn::GetAtt', [ names.role('', 'my-table-name'), 'Arn' ])
  })
})
