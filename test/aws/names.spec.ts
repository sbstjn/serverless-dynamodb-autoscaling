import * as names from '../../src/aws/names'

describe('Clean', () => {
  it('removes non alphanumeric characters', () => {
    expect(names.clean('a-b-c')).toBe('abc')
    expect(names.clean('a-b_c')).toBe('abc')
    expect(names.clean('A-b_9')).toBe('Ab9')
    expect(names.clean('A/b*9')).toBe('Ab9')
    expect(names.clean('Ä-ç_9')).toBe('9')
  })
})

describe('Names', () => {
  it('creates name for Role', () => {
    expect(
      names.role('service', 'test-with-invalid-characters')
    ).toBe('serviceDynamoDBAutoscaleRoletestwithinvalidcharacters')
  })

  it('creates name for Role with index and stage', () => {
    expect(
      names.role('service', 'test-with-invalid-characters', 'index', 'stage')
    ).toBe('serviceDynamoDBAutoscaleRoletestwithinvalidcharactersindexstage')
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
    expect(
      names.policyRole('', 'test-with-invalid-characters')
    ).toBe('DynamoDBAutoscalePolicytestwithinvalidcharacters')
  })

  it('creates name for PolicyScale (read)', () => {
    expect(
      names.policyScale('', 'test-with-invalid-characters', true)
    ).toBe('TableReadScalingPolicytestwithinvalidcharacters')
  })

  it('creates name for PolicyScale (write)', () => {
    expect(
      names.policyScale('', 'test-with-invalid-characters', false)
    ).toBe('TableWriteScalingPolicytestwithinvalidcharacters')
  })

  it('creates name for Target (read)', () => {
    expect(
      names.target('', 'test-with-invalid-characters', true)
    ).toBe('AutoScalingTargetReadtestwithinvalidcharacters')
  })

  it('creates name for Target (write)', () => {
    expect(
      names.target('', 'test-with-invalid-characters', false)
    ).toBe('AutoScalingTargetWritetestwithinvalidcharacters')
  })
})
