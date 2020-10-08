# Async Hooks Context
[![NPM Version](https://badge.fury.io/js/async-hooks-context.svg)](https://badge.fury.io/js/async-hooks-context)
[![Build Status](https://travis-ci.org/ToeFungi/async-hooks-context.svg?branch=master)](https://travis-ci.org/ToeFungi/async-hooks-context)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=async-hooks-context&metric=alert_status)](https://sonarcloud.io/dashboard?id=async-hooks-context)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=async-hooks-context&metric=bugs)](https://sonarcloud.io/dashboard?id=async-hooks-context)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=async-hooks-context&metric=code_smells)](https://sonarcloud.io/dashboard?id=async-hooks-context)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=async-hooks-context&metric=coverage)](https://sonarcloud.io/dashboard?id=async-hooks-context)
![David](https://img.shields.io/david/ToeFungi/async-hooks-context)

This library is designed to create a request scoped context, in which any data about the request can be stored. This was
initially created to store a request scoped correlation ID for logging purposes but exposes more generic functionality
to allow it to be used for multiple purposes. The library is powered by the native `async_hooks` lib.

## Getting Started
This is how to get a copy of this working locally. The only requirement is that Node is installed on the base machine.
```bash
$ git clone git@github.com:ToeFungi/async-hooks-context.git
$ cd async-hooks-context
$ npm i
```

## Installation
Install this Async Hooks Context library via npm.
```bash
$ npm i --save async-hooks-context
```

## Usage
To ensure that the context is available, it should be created at the top level of your function. 

#### Correlation IDs - Get / Set
Call the `setCorrelationId()` function in the global or parent scope. This will generate a new UUID v4 string as the 
correlation ID for all downstream scopes and become available in all child calls. In some cases, the function might need
to be wrapped to ensure the context is set correctly. 
```TypeScript
import { getCorrelationId, setCorrelationId } from './AsyncHooksContext'

// Generates a new UUID v4 string and sets it to the request scope as the correlation ID
setCorrelationId()

const foo = () => {
  // Returns the correlation ID for the request scope or undefined if not set
  return getCorrelationId()
}

// UUID v4 string
console.log(foo())
```

In the case that you want to set the correlation ID based on an incoming object, the top level function should be
wrapped and the correlation ID set within the wrapper. This ensures that the context is available in the scope of the
child function.
```TypeScript
import { getCorrelationId, setCorrelationId } from './AsyncHooksContext'

const data = {
  correlationId: 'xxxx-xxxx-xxxx-xxxx'
}

const foo = (data: object) => {
  return getCorrelationId()
}

// Wrapper to ensure that the context is in the proper scope for the child function
const wrapper = (data: object) => {
  // Explicitly set a correlation ID
  setCorrelationId(data.correlationId)
  return foo(data)
}

// UUID v4 string
console.log(wrapper(data))
```

#### Context Objects - Get / Set
Call the `upsertRequestContext()` function in the global or parent scope and pass in the object that should be stored.
This will create or update the existing context with the new data provided. An object that is passed with the same keys
will overwrite duplicate keys. The correlation ID will also be available in the returned context.
```TypeScript
import { getRequestContext, upsertRequestContext } from './AsyncHooksContext'

const data = {
  meta: 'data'
}

const foo = () => {
  // Returns the current request scoped context
  return getRequestContext()
}

// Wrapper to ensure that the context is in the proper scope for the child function
const wrapper = (data: object) => {
  // Pass the data required in the context, into the upsert function
  upsertRequestContext(data)
  return foo()
}

console.log(wrapper(data))
```

#### Cleaning Up
When the request ends, the context will be removed from the current stored contexts. If however, a use case arises in
which the current request context needs to be removed, call the `cleanContext()` function.
```TypeScript
import { cleanContext, getCorrelationId, setCorrelationId } from './AsyncHooksContext'

const foo = () => {
  console.log(getCorrelationId()) // UUID v4 string
  cleanContext()
  console.log(getCorrelationId()) // undefined
}

const wrapper = () => {
  setCorrelationId()
  return foo()
}
```

## Running Tests
To run tests, you should be able to simply run be able to run 
```bash
$ npm run test
$ npm run coverage
```
Testing tools that are used includes Mocha, Chai, Sinon, and nyc.

## Contributions
This project is completely open source and as such, you are invited to make contributions. Fork the project, make some
changes and make the pull request. Should you have any feedback regarding the functionality, please don't hesitate to
open an issue so this can be resolved. Please ensure that any pull requests have unit tests that cover any additional
functionality.

## License
MIT License

Copyright (c) 2019 Alex Pickering
