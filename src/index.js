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

function setHeaders(request, headers) {
  if (headers) {
    for (const headerName in headers) {
      request.set(headerName, headers[headerName]);
    }
  }
}

export default class ApiClient {
  constructor(host) {
    host = host || '';
    this.defaultHeaders = {};

    methods.forEach((method) => {
      this[method] = (path, { params, data, headers, file } = {}) =>
      new Promise((resolve, reject) => {
        const request = superagent[method](host + formatUrl(path));
        if (params) {
          request.query(params);
        }

        setHeaders(request, this.defaultHeaders);
        setHeaders(request, headers);

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

  addDefaultHeader(name, value) {
    this.defaultHeaders[name] = value;
    return this;
  }

  removeDefaultHeader(name, value) {
    Reflect.deleteProperty(this.defaultHeaders, name);
    return this;
  }
}
