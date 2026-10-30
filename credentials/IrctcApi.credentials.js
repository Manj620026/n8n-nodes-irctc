'use strict';

class IrctcApi {
  constructor() {
    this.name = 'irctcApi';
    this.displayName = 'IRCTC API';
    this.documentationUrl = 'https://irctc.dev/docs';
    this.properties = [
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        description: 'Your secret API key from irctc.dev. Claim 10,000 free credits at https://irctc.dev/dashboard',
      },
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://api.irctc.dev',
        required: false,
        description: 'API Gateway Base URL',
      },
    ];
  }
}

module.exports = { IrctcApi };
