import * as uuid from 'uuid'
import * as asyncHooks from 'async_hooks'

const store = new Map()

const asyncHook = asyncHooks.createHook({
  init: (asyncId, _, triggerAsyncId) => {
    if (store.has(triggerAsyncId)) {
      store.set(asyncId, store.get(triggerAsyncId))
    }
  },
  destroy: (asyncId) => {
    if (store.has(asyncId)) {
      store.delete(asyncId)
    }
  }
})

asyncHook.enable()

const createRequestContext = (data?: object, correlationId = uuid.v4()) => {
  const requestInfo = { correlationId, data }
  store.set(asyncHooks.executionAsyncId(), requestInfo)
  return requestInfo
}

const getRequestContext = () => {
  return store.get(asyncHooks.executionAsyncId())
}

export { createRequestContext, getRequestContext }
