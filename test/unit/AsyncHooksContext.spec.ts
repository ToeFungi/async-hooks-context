import * as uuid from 'uuid'
import * as asyncHooks from 'async_hooks'

import { expect } from 'chai'
import { createSandbox } from 'sinon'

import { Bar, Foo } from '../mocks/Foo'
import { cleanContext, getCorrelationId, getRequestContext, setCorrelationId, upsertRequestContext } from '../../src'

describe('AsyncHooksContext', () => {
  const sandbox = createSandbox()

  const correlationId = 'some-context-id'
  const data = {
    meta: 'data'
  }

  afterEach(() => {
    sandbox.restore()
    cleanContext()
  })

  describe('#setCorrelationId', () => {
    let v4Stub: any

    beforeEach(() => {
      v4Stub = sandbox.stub(uuid, 'v4')

      v4Stub.onFirstCall()
        .returns(correlationId)
    })

    it('returns the correlation ID after generating a new ID and storing it in the context', () => {
      const response = setCorrelationId()
      const storedCorrelationId = getCorrelationId()

      response.should.deep.equal(correlationId)
      storedCorrelationId.should.deep.equal(correlationId)
      v4Stub.should.have.callCount(1)
    })

    it('returns the specified correlation ID after storing it in the context', () => {
      const response = setCorrelationId(correlationId)
      const storedCorrelationId = getCorrelationId()

      response.should.deep.equal(correlationId)
      storedCorrelationId.should.deep.equal(correlationId)
      v4Stub.should.have.callCount(0)
    })

    it('returns the specified correlation ID after updating the context', () => {
      const expectedContext = {
        ...data,
        correlationId
      }

      upsertRequestContext(data)

      const response = setCorrelationId(correlationId)
      const storedContext = getRequestContext()

      response.should.deep.equal(correlationId)
      storedContext.should.deep.equal(expectedContext)
    })
  })

  describe('#upsertRequestContext', () => {
    it('returns the data after creating a context with the supplied data', () => {
      const response = upsertRequestContext(data)
      const contextData = getRequestContext()

      response.should.deep.equal(data)
      contextData.should.deep.equal(contextData)
    })

    it('returns the data after updating a context with the supplied data', () => {
      const expectedContext = {
        correlationId,
        ...data
      }

      setCorrelationId(correlationId)

      const response = upsertRequestContext(data)
      const contextData = getRequestContext()

      response.should.deep.equal(data)
      contextData.should.deep.equal(expectedContext)
    })

    it('returns the data after updating and overwriting existing keys in the context with the supplied data', () => {
      const updatedData = {
        meta: 'foo'
      }

      const expectedContext = {
        correlationId,
        ...updatedData
      }

      setCorrelationId(correlationId)

      upsertRequestContext(data)
      upsertRequestContext(updatedData)

      const contextData = getRequestContext()

      contextData.should.deep.equal(expectedContext)
    })
  })

  describe('#getCorrelationId', () => {
    it('returns the correlation ID currently stored in the context', () => {
      setCorrelationId(correlationId)

      return getCorrelationId()
        .should.deep.equal(correlationId)
    })

    it('returns undefined when the correlation ID was not found in the stored context', () => {
      const executionAsyncIdStub = sandbox.stub(asyncHooks, 'executionAsyncId')

      executionAsyncIdStub.onFirstCall()
        .returns(-1)

      return expect(getCorrelationId()).to.be.undefined
    })
  })

  describe('#getRequestContext', () => {
    it('returns the currently stored context if found', () => {
      upsertRequestContext(data)

      return getRequestContext()
        .should.deep.equal(data)
    })

    it('returns undefined when there is nothing stored in the current context', () => {
      const executionAsyncIdStub = sandbox.stub(asyncHooks, 'executionAsyncId')

      executionAsyncIdStub.onFirstCall()
        .returns(-1)

      return expect(getRequestContext()).to.be.undefined
    })
  })

  describe('#cleanContext', () => {
    it('removes all existing contexts from the request scope', () => {
      upsertRequestContext(data)

      const createdContext = getRequestContext()
      createdContext.should.deep.equal(data)

      cleanContext()

      return expect(getRequestContext()).to.be.undefined
    })
  })

  context('wrapping a class', () => {
    it('returns the correlation ID from within a class', () => {
      setCorrelationId(correlationId)

      const foo = new Foo()
      const bar = new Bar(foo)

      return bar.getCorrelation()
        .should.deep.equal(correlationId)
    })

    it('returns the context from within a class', () => {
      upsertRequestContext(data)

      const foo = new Foo()
      const bar = new Bar(foo)

      return bar.getContext()
        .should.deep.equal(data)
    })
  })
})
