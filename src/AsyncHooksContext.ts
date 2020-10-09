import * as uuid from 'uuid'
import * as asyncHooks from 'async_hooks'

/**
 * Store for the request scoped context
 */
const contexts = new Map()

// Configuration used for the async hooks context
const asyncHooksConfig: asyncHooks.HookCallbacks = {
  init: (asyncId: number, _: string, triggerAsyncId: number) => {
    if (contexts.has(triggerAsyncId)) {
      contexts.set(asyncId, contexts.get(triggerAsyncId))
    }
  },
  destroy: (asyncId: number) => {
    if (contexts.has(asyncId)) {
      contexts.delete(asyncId)
    }
  }
}

// Create the async hooks context
const asyncHook = asyncHooks.createHook(asyncHooksConfig)

// Enable the async hooks context
asyncHook.enable()

/**
 * Create or update the request context with the specified data
 * @private
 */
const updateContext = (data: object) => {
  const existingContext = contexts.get(asyncHooks.executionAsyncId())

  if (existingContext) {
    const updatedContext = {
      ...existingContext,
      ...data
    }

    contexts.set(asyncHooks.executionAsyncId(), updatedContext)
    return data
  }

  contexts.set(asyncHooks.executionAsyncId(), { ...data })
  return data
}

/**
 * Creates or updates the context and stores a correlation ID for logging
 */
const setCorrelationId = (correlationId: string = uuid.v4()): string => {
  const correlationContext = { correlationId }
  updateContext(correlationContext)
  return correlationId
}

/**
 * Creates or updates the context for the current request and stores the passed object
 */
const updateRequestContext = (data: object) => {
  updateContext(data)
  return data
}

/**
 * Retrieve the correlation ID stored in request context if created
 */
const getCorrelationId = (): string => {
  const context = contexts.get(asyncHooks.executionAsyncId())
  return context?.correlationId
}

/**
 * Retrieves the object stored in request context is created
 */
const getRequestContext = (): object => {
  return contexts.get(asyncHooks.executionAsyncId())
}

/**
 * Clean up all existing contexts that are stored. This does not kill the async_hook thread however.
 */
const cleanContext = () => {
  return contexts.delete(asyncHooks.executionAsyncId())
}

export { setCorrelationId, updateRequestContext, getCorrelationId, getRequestContext, cleanContext }
