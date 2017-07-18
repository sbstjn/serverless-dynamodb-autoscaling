const names = require('../../src/aws/names')

describe('Names', () => {
  it('creates name for Role', () => {
    expect(names.role('test-with-invalid-characters')).toBe('DynamoDBAutoscaleRoletestwithinvalidcharacters')
  })

  it('creates name for Metric (read)', () => {
    expect(names.metric(true)).toBe('DynamoDBReadCapacityUtilization')
  })

  it('creates name for Metric (write)', () => {
    expect(names.metric(false)).toBe('DynamoDBWriteCapacityUtilization')
  })

  it('creates name for Dimension (read)', () => {
    expect(names.dimension(true)).toBe('dynamodb:table:ReadCapacityUnits')
  })

  it('creates name for Dimension (write)', () => {
    expect(names.dimension(false)).toBe('dynamodb:table:WriteCapacityUnits')
  })

  it('creates name for PolicyRole', () => {
    expect(names.policyRole('test-with-invalid-characters')).toBe('DynamoDBAutoscalePolicytestwithinvalidcharacters')
  })

  it('creates name for PolicyScale (read)', () => {
    expect(names.policyScale('test-with-invalid-characters', true)).toBe('TableReadScalingPolicytestwithinvalidcharacters')
  })

  it('creates name for PolicyScale (write)', () => {
    expect(names.policyScale('test-with-invalid-characters', false)).toBe('TableWriteScalingPolicytestwithinvalidcharacters')
  })

  it('creates name for Target (read)', () => {
    expect(names.target('test-with-invalid-characters', true)).toBe('AutoScalingTargetReadtestwithinvalidcharacters')
  })

  it('creates name for Target (write)', () => {
    expect(names.target('test-with-invalid-characters', false)).toBe('AutoScalingTargetWritetestwithinvalidcharacters')
  })
})
