import isFunction from 'lodash/isFunction';
import antwarConfig from 'antwarConfig';

if (isFunction(antwarConfig)) {
  module.exports = antwarConfig(__ENV__);
} else {
  module.exports = antwarConfig;
}
