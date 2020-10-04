import { AsyncHooksContexts } from '../../src'

class Foo {
  public bar() {
    return AsyncHooksContexts.getContext()
  }
}

class Bar {
  constructor(private foo: Foo) {
  }

  public bar() {
    return this.foo.bar()
  }
}

export { Foo, Bar }
