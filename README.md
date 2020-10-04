# Async Hooks Context
[![NPM Version](https://badge.fury.io/js/async-hooks-context.svg)](https://badge.fury.io/js/async-hooks-context)
[![Build Status](https://travis-ci.org/ToeFungi/async-hooks-context.svg?branch=master)](https://travis-ci.org/ToeFungi/async-hooks-context)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=async-hooks-context&metric=alert_status)](https://sonarcloud.io/dashboard?id=async-hooks-context)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=async-hooks-context&metric=bugs)](https://sonarcloud.io/dashboard?id=async-hooks-context)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=async-hooks-context&metric=code_smells)](https://sonarcloud.io/dashboard?id=async-hooks-context)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=async-hooks-context&metric=coverage)](https://sonarcloud.io/dashboard?id=async-hooks-context)
![David](https://img.shields.io/david/ToeFungi/async-hooks-context)

A library that can be used to create a request scoped context. This can be used to store a correlation ID for logging
and any other variables that may need to be accessed during a request. This library is not instantiated in a middleware
component like many others and requires no external libraries to function.

## Getting Started
This is how to get a copy of this working locally. The only requirement is that Node is installed on the base machine.
```bash
$ git clone git@github.com:ToeFungi/async-hooks-context.git
$ cd async-hooks-context
$ npm i
```

## Usage
Simply wrap the execution of a function within the `initContext`, add the required property to the `context` object and
it will become available during the execution via the `getContext()` function.
```
import { AsyncHooksContexts } from './AsyncHooksContext'

class Foo {
  public bar() {
    return AsyncHooksContexts.getContext()
  }
}

const foo = new Foo()

const { id } = AsyncHooksContexts.initContext((context: any) => {
  context.id = 'some-context-id'
  foo.bar()
})

// some-context-id
console.log(id)
```

## Running Tests
To run tests, you should be able to simply run be able to run 
```bash
$ npm run test
$ npm run coverage
```
The testing framework used is Mocha. Chai, Chai-as-promised and nyc are used for assertions and coverage reporting.
Should you make a change request, please ensure that the new changes are appropriately covered by accompanying tests.

## Contributions
This project is completely open source and as such, you are invited to make contributions. Fork the project, make some
changes and make the pull request. Should you have any feedback regarding the functionality, please don't hesitate to
open an issue so this can be resolved. Please ensure that any pull requests have unit tests that cover any additional
functionality.

## License
MIT License

Copyright (c) 2019 Alex Pickering
