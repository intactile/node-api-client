# node-api-client
A basic node REST api client based on [superagent](http://visionmedia.github.io/superagent/).


[![Build Status](https://travis-ci.org/intactile/node-api-client.svg?branch=master)](https://travis-ci.org/intactile/node-api-client)
[![Code Climate](https://codeclimate.com/github/intactile/node-api-client/badges/gpa.svg)](https://codeclimate.com/github/intactile/node-api-client)
[![Test Coverage](https://codeclimate.com/github/intactile/node-api-client/badges/coverage.svg)](https://codeclimate.com/github/intactile/node-api-client/coverage)

## Install

```bash
npm install @intactile/node-api-client
```

## Usage

```javascript
import ApiClient from '@intactile/node-api-client';

const apiClient = new ApiClient();
apiClient.post('users', { firstName: 'John', lastName: 'Doe'  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```
