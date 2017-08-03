declare namespace Serverless {
  interface Options {
    stage: string | null
    region: string | null
    noDeploy?: boolean
  }
  
  namespace Provider {
    class Aws {
      constructor(serverless: Serverless, options: Serverless.Options)
      
      getProviderName: () => string
      getRegion: () => string
      getServerlessDeploymentBucketName: () => string
      getStage: () => string

      request: (service: string, method: string, data: {}, stage: string, region: string) => Promise<any>
    }
  }

  namespace Service {
    interface Custom { }
  }
}

declare interface Serverless {
  init(): Promise<any>
  run(): Promise<any>
  
  setProvider(name: string, provider: Serverless.Provider.Aws): null
  getProvider(name: string): Serverless.Provider.Aws
  
  getVersion(): string
  
  cli: {
    log(message: string): null
  }
  
  config: {
    servicePath: string
  }

  service: {
    getServiceName(): string
    getAllFunctions(): string[]

    custom: Serverless.Service.Custom

    provider: {
      compiledCloudFormationTemplate: {
        Resources: any[]
      }

      name: string
    }
  }
}
