
global.should = require('chai').should()
global.ObjectStream = require('../object')
global.StringStream = require('../string')
global.BufferStream = require('../buffer')

require('./object/queue.test')
require('./object/pipe.test')
require('./string/queue.test')
require('./string/pipe.test')
require('./buffer/queue.test')
require('./buffer/pipe.test')