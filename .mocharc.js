module.exports = {
  require: [
    'ts-node/register',
    'source-map-support/register',
    './test/support/setup.spec.ts'
  ],
  spec: './test/unit/**/*.spec.ts'
}
