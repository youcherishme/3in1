if (process.env.REACT_APP_RUNNING_ENV === 'production') {  
  module.exports = require('./keys_prod');
} else {
  module.exports = require('./keys_dev');
}
