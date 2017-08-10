declare interface Capacity {
  table: string | string[]
  index: string | string[]
  indexOnly?: boolean
  write?: CapacityConfiguration
  read?: CapacityConfiguration
}

declare interface CapacityConfiguration {
  maximum: number
  minimum: number
  usage: number
}

/**
 * Merged with empty default Serverless.Service.Custom declaration
 */
declare namespace Serverless {
  namespace Service {
    interface Custom {
      capacities: Capacity[]
    }
  }
}