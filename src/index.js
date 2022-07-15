import superagent from 'superagent';

const methods = ['get', 'head', 'post', 'put', 'patch', 'del'];

function formatUrl(path, apiName) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  const adjustedApiName = apiName !== '' ? `/${apiName}` : apiName;
  return `${adjustedApiName}${adjustedPath}`;
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
    Object.keys(headers).forEach((name) => request.set(name, headers[name]));
  }
}

export default class ApiClient {
  constructor(config) {
    config = config || {};
    const host = config.host || '';
    const apiName = config.apiName !== undefined ? config.apiName : 'api';
    this.defaultHeaders = {};

    methods.forEach((method) => {
      this[method] = (path, {
        params, data, headers, file, files, fields,
      } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](host + formatUrl(path, apiName));

        setHeaders(request, this.defaultHeaders);
        setHeaders(request, headers);

        if (params) {
          request.query(params);
        }

        // If data property is provided, send a json request
        // if no data is provided but a files property is
        // we are dealing with a multipart request
        if (data) {
          clean(data);
          request.set('Content-Type', 'application/json');
          request.send(data);
        } else if (file || files) {
          if (files) {
            Object.entries(files).forEach((f) => request.attach(f[0], f[1]));
          } else if (file) {
            request.attach('file', file);
          }

          if (fields) {
            Object.entries(fields).forEach((field) => request.field(field[0], field[1]));
          }
        }

        request.end((error, response) => (error ? reject(response || error) : resolve(response)));
      });
    });
  }

  addDefaultHeader(name, value) {
    this.defaultHeaders[name] = value;
    return this;
  }

  removeDefaultHeader(name) {
    Reflect.deleteProperty(this.defaultHeaders, name);
    return this;
  }
}
