import * as asyncHooks from 'async_hooks'

/**
 * Execution contexts
 */
const contexts: any = {}

/**
 * Async Hooks Context creates and retrieves the context for an execution
 */
class AsyncHooksContexts {
  /**
   * Initialise the context for the current execution
   */
  public static initContext(fn: Function) {
    const asyncResource = new asyncHooks.AsyncResource('REQUEST_CONTEXT')
    return asyncResource.runInAsyncScope(() => {
      const asyncId = asyncHooks.executionAsyncId()
      contexts[asyncId] = {}
      return fn(contexts[asyncId])
    })
  }

  /**
   * Get the current execution context
   */
  public static getContext() {
    const asyncId = asyncHooks.executionAsyncId()
    return contexts[asyncId] || {}
  }
}

export { AsyncHooksContexts }
