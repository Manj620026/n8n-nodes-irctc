'use strict';

/**
 * Automated Test Suite for n8n-nodes-irctc Community Node & Credentials
 * Validates n8n node specification, properties schema, resource definitions, all 14 operations, and execution handlers.
 */

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { Irctc } = require('../nodes/Irctc/Irctc.node');
const { IrctcApi } = require('../credentials/IrctcApi.credentials');

async function runTests() {
  console.log('🧪 RUNNING N8N-NODES-IRCTC COMPREHENSIVE SUITE');
  console.log('─'.repeat(55));

  let passed = 0;
  let total = 0;

  function testAssert(condition, name) {
    total++;
    if (condition) {
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${name}`);
      process.exitCode = 1;
    }
  }

  // 1. Credentials Definition
  console.log('1. Testing IrctcApi credentials definition...');
  const creds = new IrctcApi();
  testAssert(creds.name === 'irctcApi', 'Credential name is irctcApi');
  testAssert(creds.displayName === 'IRCTC API', 'Display name is IRCTC API');
  testAssert(Array.isArray(creds.properties), 'Properties is an array');

  const apiKeyProp = creds.properties.find((p) => p.name === 'apiKey');
  testAssert(apiKeyProp && apiKeyProp.type === 'string', 'apiKey property exists as string');
  testAssert(apiKeyProp.typeOptions?.password === true, 'apiKey is marked as password/secret');

  // 2. Node Description & Metadata
  console.log('\n2. Testing Irctc node definition & metadata...');
  const node = new Irctc();
  const desc = node.description;

  testAssert(desc.name === 'irctc', 'Node name is irctc');
  testAssert(desc.displayName === 'IRCTC Indian Railways', 'Display name matches specification');
  testAssert(desc.icon === 'file:irctc.svg', 'Node declares file:irctc.svg as official high-res icon');
  testAssert(fs.existsSync(path.join(__dirname, '../nodes/Irctc/irctc.svg')), 'irctc.svg physical file exists on disk');
  testAssert(desc.credentials?.[0]?.name === 'irctcApi', 'Declares irctcApi credential requirement');
  testAssert(Array.isArray(desc.properties), 'Properties is an array');

  // 3. Resource & Operations Verification (All 14 endpoints)
  console.log('\n3. Testing resources and operations across all 14 endpoints...');
  const resourceProp = desc.properties.find((p) => p.name === 'resource');
  testAssert(resourceProp && resourceProp.options?.length === 5, 'Exposes 5 core resources (pnr, liveStatus, trains, stations, health)');

  const resourceValues = resourceProp.options.map((o) => o.value);
  testAssert(resourceValues.includes('pnr'), 'Resource pnr registered');
  testAssert(resourceValues.includes('liveStatus'), 'Resource liveStatus registered');
  testAssert(resourceValues.includes('trains'), 'Resource trains registered');
  testAssert(resourceValues.includes('stations'), 'Resource stations registered');
  testAssert(resourceValues.includes('health'), 'Resource health registered');

  // Verify operations under trains
  const trainOps = desc.properties.find(
    (p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('trains')
  );
  testAssert(trainOps && trainOps.options.length === 8, 'Found 8 train operations');
  const trainOpValues = trainOps.options.map((o) => o.value);
  testAssert(trainOpValues.includes('search'), 'Operation search registered');
  testAssert(trainOpValues.includes('getAvailability'), 'Operation getAvailability registered');
  testAssert(trainOpValues.includes('getChartVacant'), 'Operation getChartVacant registered');
  testAssert(trainOpValues.includes('getFare'), 'Operation getFare registered');
  testAssert(trainOpValues.includes('getSchedule'), 'Operation getSchedule registered');
  testAssert(trainOpValues.includes('getByNumber'), 'Operation getByNumber registered');
  testAssert(trainOpValues.includes('searchByName'), 'Operation searchByName registered');
  testAssert(trainOpValues.includes('getCancelled'), 'Operation getCancelled registered');

  // Verify operations under stations
  const stationOps = desc.properties.find(
    (p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('stations')
  );
  testAssert(stationOps && stationOps.options.length === 3, 'Found 3 station operations');
  const stationOpValues = stationOps.options.map((o) => o.value);
  testAssert(stationOpValues.includes('searchStations'), 'Operation searchStations registered');
  testAssert(stationOpValues.includes('getByCode'), 'Operation getByCode registered');
  testAssert(stationOpValues.includes('getTimetable'), 'Operation getTimetable registered');

  // 4. Input Parameters Validation
  console.log('\n4. Testing parameter schema bindings...');
  const propNames = desc.properties.map((p) => p.name);
  testAssert(propNames.includes('pnrNumber'), 'pnrNumber parameter defined');
  testAssert(propNames.includes('trainNumber'), 'trainNumber parameter defined');
  testAssert(propNames.includes('trainName'), 'trainName parameter defined');
  testAssert(propNames.includes('stationCode'), 'stationCode parameter defined');
  testAssert(propNames.includes('stationQuery'), 'stationQuery parameter defined');
  testAssert(propNames.includes('fromStation'), 'fromStation parameter defined');
  testAssert(propNames.includes('toStation'), 'toStation parameter defined');
  testAssert(propNames.includes('boardingStation'), 'boardingStation parameter defined');
  testAssert(propNames.includes('date'), 'date parameter defined');
  testAssert(propNames.includes('travelClass'), 'travelClass parameter defined');
  testAssert(propNames.includes('quota'), 'quota parameter defined');

  // 5. Package License Verification
  testAssert(fs.existsSync(path.join(__dirname, '../LICENSE')), 'MIT LICENSE file exists on disk');

  // 6. Runtime Execution & Context Binding Tests (Ponytail QA)
  console.log('\n6. Testing runtime execution context binding (this vs context parameter)...');
  const originalFetch = global.fetch;
  let lastFetchCall = null;
  global.fetch = async (url, options) => {
    lastFetchCall = { url, options };
    if (url.includes('/health')) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ status: 'up', version: '1.0.2' }),
      };
    }
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ success: true, data: { ok: true } }),
    };
  };

  try {
    // 6a. Standard n8n invocation: nodeType.execute.call(thisContext) where context is undefined
    const mockContextThis = {
      getInputData: () => [{ json: {} }],
      getCredentials: async () => ({ apiKey: 'irctc_live_test_key', baseUrl: 'https://api.irctc.dev' }),
      getNodeParameter: (paramName) => {
        if (paramName === 'resource') return 'health';
        if (paramName === 'operation') return 'getHealth';
        return '';
      },
      continueOnFail: () => false,
    };

    const resultThis = await node.execute.call(mockContextThis);
    testAssert(Array.isArray(resultThis) && resultThis[0]?.length === 1, 'node.execute.call(this) succeeds without crashing');
    testAssert(
      resultThis[0][0]?.json?.status === 'up' && resultThis[0][0]?.json?.version === '1.0.2',
      'Engine Health response strictly returns { status: "up", version: "1.0.2" }'
    );
    testAssert(lastFetchCall?.url === 'https://api.irctc.dev/health', 'Health fetch URL matches https://api.irctc.dev/health');
    testAssert(lastFetchCall?.options?.headers?.['x-api-key'] === 'irctc_live_test_key', 'Headers include x-api-key credential');

    // 6b. Alternative invocation: node.execute(context)
    const mockContextArg = {
      getInputData: () => [{ json: {} }],
      getCredentials: async () => ({ apiKey: 'irctc_key_2', baseUrl: 'https://api.irctc.dev' }),
      getNodeParameter: (paramName) => {
        if (paramName === 'resource') return 'health';
        if (paramName === 'operation') return 'getHealth';
        return '';
      },
      continueOnFail: () => false,
    };

    const resultArg = await node.execute(mockContextArg);
    testAssert(Array.isArray(resultArg) && resultArg[0]?.length === 1, 'node.execute(context) parameter invocation succeeds');

    // 6c. SSRF Protocol Smuggling Guard Test
    const mockContextSsrf = {
      getInputData: () => [{ json: {} }],
      getCredentials: async () => ({ apiKey: '', baseUrl: 'file:///etc/passwd' }),
      getNodeParameter: (paramName) => {
        if (paramName === 'resource') return 'health';
        if (paramName === 'operation') return 'getHealth';
        return '';
      },
      continueOnFail: () => false,
    };

    await node.execute(mockContextSsrf);
    testAssert(
      lastFetchCall?.url.startsWith('https://api.irctc.dev'),
      'SSRF Guard: file:/// protocol safely falls back to default https://api.irctc.dev'
    );

    // 6d. URL parameter injection & sanitization test (Availability with query params)
    const mockContextAvail = {
      getInputData: () => [{ json: {} }],
      getCredentials: async () => ({ apiKey: 'test', baseUrl: 'https://api.irctc.dev' }),
      getNodeParameter: (paramName) => {
        const params = {
          resource: 'trains',
          operation: 'getAvailability',
          trainNumber: '12557',
          fromStation: 'NDLS',
          toStation: 'PNBE & GKP', // Contains & to test HPP prevention
          date: '25-10-2026',
          travelClass: '3A',
          quota: 'GN',
        };
        return params[paramName] || '';
      },
      continueOnFail: () => false,
    };

    await node.execute(mockContextAvail);
    testAssert(
      lastFetchCall?.url.includes('to=PNBE%20%26%20GKP'),
      'URL Parameter Sanitization: ampersand & spaces in query params are safely URL encoded'
    );

    // 6e. PNR 10-digit validation test
    const mockContextBadPnr = {
      getInputData: () => [{ json: {} }],
      getCredentials: async () => ({ apiKey: 'test', baseUrl: 'https://api.irctc.dev' }),
      getNodeParameter: (paramName) => {
        if (paramName === 'resource') return 'pnr';
        if (paramName === 'operation') return 'check';
        if (paramName === 'pnrNumber') return '123'; // Invalid 3 digits
        return '';
      },
      continueOnFail: () => false,
    };

    let pnrThrew = false;
    try {
      await node.execute(mockContextBadPnr);
    } catch (err) {
      pnrThrew = err.message.includes('Invalid PNR number');
    }
    testAssert(pnrThrew, 'PNR validation: rejects invalid non-10-digit PNR input');

    // 6f. Screenshot Defect Fix: ExecuteContext without direct getInputData (e.g. standalone test step in n8n)
    const mockContextNoGetInputData = {
      // Notice: getInputData is deliberately omitted/undefined (simulating ExecuteContext standalone)
      getNodeParameter: (paramName) => {
        if (paramName === 'resource') return 'liveStatus';
        if (paramName === 'operation') return 'getStatus';
        if (paramName === 'trainNumber') return '12557';
        if (paramName === 'date') return '28-10-2026';
        return '';
      },
      getCredentials: async () => ({ apiKey: 'test', baseUrl: 'https://api.irctc.dev' }),
      continueOnFail: () => false,
    };

    let noInputCrash = false;
    let resultNoInput = null;
    try {
      resultNoInput = await node.execute.call(mockContextNoGetInputData);
    } catch (err) {
      noInputCrash = true;
    }
    testAssert(!noInputCrash, 'Screenshot Fix: Node executes cleanly without crashing even when getInputData is not a function');
    testAssert(
      lastFetchCall?.url.includes('/api/v1/live/12557?date=28-10-2026'),
      'Standalone Execution: Correctly queries live status for train 12557 with date 28-10-2026'
    );

  } finally {
    global.fetch = originalFetch;
  }

  console.log(`\n🎉 RESULTS: ${passed}/${total} assertions passed (${Math.round((passed / total) * 100)}%)\n`);
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exitCode = 1;
});
