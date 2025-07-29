var h = require('virtual-dom/h')

var tree = h('div.foo#some-id', [
    h('span', 'some text'),
    h('input', { type: 'text', value: 'foo' })
])