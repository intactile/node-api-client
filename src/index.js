import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  return `/api${adjustedPath}`;
}

function clean(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      Reflect.deleteProperty(obj, key);
    }
  });
}

export default class ApiClient {
  constructor(host) {
    host = host || '';
    methods.forEach((method) => {
      this[method] = (path, { params, data, file } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](host + formatUrl(path));
        if (params) {
          request.query(params);
        }

        if (data) {
          clean(data);
          request.set('Content-Type', 'application/json');
          request.send(data);
        } else if (file) {
          request.attach('file', file);
        }
        request.end((error, response) => (error ? reject(response || error) : resolve(response)));
      });
    });
  }

  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */

  /* eslint-disable class-methods-use-this */
  empty() {}
  /* eslint-enable class-methods-use-this */
}
