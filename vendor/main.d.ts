declare interface Capacity {
  table: string | string[]
  index: string | string[]
  indexOnly?: boolean
  write?: CapacityConfiguration
  read?: CapacityConfiguration
  generateRoles?: boolean
}

declare interface CapacityConfiguration {
  maximum: number
  minimum: number
  usage: number
}

declare interface Options {
  index: string
  region: string
  service: string
  stage: string
  table: string
  role?: string
}

declare interface AutoScalingOptions {
  role?: string // external role logical id
  capacities: Capacity[]
}

/**
 * Merged with empty default Serverless.Service.Custom declaration
 */
declare namespace Serverless {
  namespace Service {
    interface Custom {
      ['dynamodb-autoscaling']: AutoScalingOptions
    }
  }
}
