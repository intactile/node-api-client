import nock from 'nock';
import ApiClient from './';

describe('The ApiClient', () => {
  const host = 'http://intactile.com:9999';
  const client = new ApiClient(host);
  it('should declare a get method', () => {
    expect(client.get).toBeDefined();
  });
  it('should declare a post method', () => {
    expect(client.post).toBeDefined();
  });
  it('should declare a put method', () => {
    expect(client.put).toBeDefined();
  });
  it('should declare a patch method', () => {
    expect(client.patch).toBeDefined();
  });
  it('should declare a del method', () => {
    expect(client.del).toBeDefined();
  });

  it('should resolve the returned promise if the response is a success', () => {
    const toto = { description: 'Roger', test: null, test2: undefined };
    const cleandToto = { description: 'Roger' };
    const createdToto = { id: 12, description: 'Roger' };
    nock(host)
      .matchHeader('Content-Type', 'application/json')
      .post('/api/totos', cleandToto).reply(201, createdToto);

    return client.post('totos', { data: toto })
      .then((response) => {
        expect(response.status).toEqual(201);
        expect(response.body).toEqual(createdToto);
      });
  });

  it('should reject the returned promise if the response is a failure', () => {
    nock(host).get('/api/totos/12').reply(404, 'There is no such toto');

    return client.get('totos/12')
      .catch((response) => {
        expect(response.status).toEqual(404);
        expect(response.text).toEqual('There is no such toto');
      });
  });

  it('should pass the supplied query', () => {
    const totos = [{ description: 'Roger' }, { description: 'Robert' }];
    const query = { role: 'admin', search: 'Ro' };
    nock(host)
      .get('/api/totos')
      .query(query)
      .reply(200, totos);

    return client.get('totos', { params: query })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(totos);
      });
  });

  it('should pass the supplied headers', () => {
    nock(host)
        .matchHeader('A', '1')
        .matchHeader('B', '2')
        .delete('/api/totos/17')
        .reply(204);

    return client.del('totos/17', {
      headers: {
        A: '1',
        B: '2',
      },
    })
      .catch((response) => {
        expect(response.status).toEqual(204);
      });
  });

  it('should pass the default supplied headers', () => {
    nock(host)
        .matchHeader('A', '1')
        .matchHeader('B', '2')
        .get('/api/titis')
        .reply(204);

    client.addDefaultHeader('A', '1');
    client.addDefaultHeader('B', '2');

    return client.get('titis')
      .catch((response) => {
        expect(response.status).toEqual(204);
      });
  });

  it('should override the default headers by the specific headers', () => {
    nock(host)
        .matchHeader('A', '1')
        .matchHeader('B', '2')
        .matchHeader('C', '3')
        .get('/api/totos/17')
        .reply(204);

    client.addDefaultHeader('B', '9')
          .addDefaultHeader('C', '3');

    return client.get('totos/17', {
      headers: {
        A: '1',
        B: '2',
      },
    })
    .catch((response) => {
      expect(response.status).toEqual(204);
    });
  });

  it('should let you to remove the specific headers', () => {
    nock(host)
        .matchHeader('A', '1')
        .matchHeader('B', val => val === undefined)
        .get('/api/totos/63')
        .reply(204);

    client.addDefaultHeader('A', '1')
          .addDefaultHeader('B', '2');
    client.removeDefaultHeader('B');

    return client.get('totos/63')
    .catch((response) => {
      expect(response.status).toEqual(204);
    });
  });
});
