import * as using from 'jasmine-data-provider'

import Name from '../../src/aws/name'

describe('Name', () => {
  describe('Everything', () => {
    const n = new Name({
      index: 'index',
      region: 'region',
      service: 'service',
      stage: 'stage',
      table: 'table'
    })

    const names = {
      dimension: 'dynamodb:index:WriteCapacityUnits',
      metricRead: 'DynamoDBReadCapacityUtilization',
      metricWrite: 'DynamoDBWriteCapacityUtilization',
      policyRole: 'serviceDynamoDBAutoscalePolicyTableIndexStageRegion',
      policyScaleRead: 'serviceTableScalingPolicyReadTableIndexStageRegion',
      policyScaleWrite: 'serviceTableScalingPolicyWriteTableIndexStageRegion',
      role: 'serviceDynamoDBAutoscaleRoleTableIndexStageRegion',
      targetRead: 'serviceAutoScalingTargetReadTableIndexStageRegion',
      targetWrite: 'serviceAutoScalingTargetWriteTableIndexStageRegion'
    }

    using(names, (data, name) => {
      it(name, () => {
        expect(n[name]()).toEqual(data)
      })
    })
  })

  describe('No Index', () => {
    const n = new Name({
      index: '',
      region: 'region',
      service: 'service',
      stage: 'stage',
      table: 'table'
    })

    const names = {
      dimension: 'dynamodb:table:WriteCapacityUnits',
      metricRead: 'DynamoDBReadCapacityUtilization',
      metricWrite: 'DynamoDBWriteCapacityUtilization',
      policyRole: 'serviceDynamoDBAutoscalePolicyTableStageRegion',
      policyScaleRead: 'serviceTableScalingPolicyReadTableStageRegion',
      policyScaleWrite: 'serviceTableScalingPolicyWriteTableStageRegion',
      role: 'serviceDynamoDBAutoscaleRoleTableStageRegion',
      targetRead: 'serviceAutoScalingTargetReadTableStageRegion',
      targetWrite: 'serviceAutoScalingTargetWriteTableStageRegion'
    }

    using(names, (data, name) => {
      it(name, () => {
        expect(n[name]()).toEqual(data)
      })
    })
  })

  describe('Truncation', () => {
    const n = new Name({
      index: '',
      region: 'region',
      service: 'service-with-a-very-long-name-so-names-are-truncated',
      stage: 'stage',
      table: 'table'
    })

    const names = {
      dimension: 'dynamodb:table:WriteCapacityUnits',
      metricRead: 'DynamoDBReadCapacityUtilization',
      metricWrite: 'DynamoDBWriteCapacityUtilization',
      policyRole: 'servicewithaverylongnamesonamesaeedda6de5ac2172c15c8d808a2cad991',
      policyScaleRead: 'servicewithaverylongnamesonamesacb30bc3280aa25bf27765929a56ea8d8',
      policyScaleWrite: 'servicewithaverylongnamesonamesabf6f2d38b9b294af2c6f8e48cc84ec85',
      role: 'servicewithaverylongnamesonamesa38d8d82ccef5e775fc294d8a83287850',
      targetRead: 'servicewithaverylongnamesonamesa141748dffb915b1a67abb08496f24e10',
      targetWrite: 'servicewithaverylongnamesonamesa299bff1b9d70923193990fde7709db57'
    }

    using(names, (data, name) => {
      it(name, () => {
        expect(n[name]()).toEqual(data)
      })
    })
  })
})
