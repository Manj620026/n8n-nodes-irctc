'use strict';

class Irctc {
  constructor() {
    this.description = {
      displayName: 'IRCTC Indian Railways',
      name: 'irctc',
      icon: 'file:irctc.svg',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
      description: 'Consume real-time Indian Railways data via irctc.dev API gateway (PNR, live GPS tracking, seat availability, vacant berths, fares)',
      defaults: {
        name: 'IRCTC API',
      },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [
        {
          name: 'irctcApi',
          required: true,
        },
      ],
      properties: [
        // Resource Selector
        {
          displayName: 'Resource',
          name: 'resource',
          type: 'options',
          options: [
            { name: 'PNR Status', value: 'pnr' },
            { name: 'Live Tracking & Station Board', value: 'liveStatus' },
            { name: 'Trains & Fares', value: 'trains' },
            { name: 'Stations & Timetables', value: 'stations' },
            { name: 'Engine Health', value: 'health' },
          ],
          default: 'pnr',
          noDataExpression: true,
          required: true,
        },

        // Operations: PNR
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          displayOptions: {
            show: {
              resource: ['pnr'],
            },
          },
          options: [
            {
              name: 'Check PNR Status',
              value: 'check',
              description: 'Check real-time PNR confirmation, coach, and berth details',
              action: 'Check PNR status',
            },
          ],
          default: 'check',
          noDataExpression: true,
        },

        // Operations: Live Tracking & Station Board
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          displayOptions: {
            show: {
              resource: ['liveStatus'],
            },
          },
          options: [
            {
              name: 'Get Live Running Status',
              value: 'getStatus',
              description: 'Get live GPS train delay, next station halt, and platform numbers',
              action: 'Get live running status',
            },
            {
              name: 'Get Live Station Board',
              value: 'getStationBoard',
              description: 'Get live arrivals and departures board for a railway station',
              action: 'Get live station board',
            },
          ],
          default: 'getStatus',
          noDataExpression: true,
        },

        // Operations: Trains & Fares
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          displayOptions: {
            show: {
              resource: ['trains'],
            },
          },
          options: [
            {
              name: 'Search Trains Between Stations',
              value: 'search',
              description: 'Search direct running trains between two station codes',
              action: 'Search trains between stations',
            },
            {
              name: 'Check Seat Availability Forecast',
              value: 'getAvailability',
              description: 'Check 14-day continuous seat availability calendar forecast',
              action: 'Check seat availability forecast',
            },
            {
              name: 'Get Vacant Berths After Chart',
              value: 'getChartVacant',
              description: 'Find vacant seats and berths post-charting for Current Booking',
              action: 'Get vacant berths after chart',
            },
            {
              name: 'Calculate Ticket Fare Breakup',
              value: 'getFare',
              description: 'Calculate official ticket fare breakup across classes',
              action: 'Calculate ticket fare breakup',
            },
            {
              name: 'Get Full Route Schedule',
              value: 'getSchedule',
              description: 'Get train full route schedule with halts, timings, and distances',
              action: 'Get full route schedule',
            },
            {
              name: 'Get Train by Number',
              value: 'getByNumber',
              description: 'Get basic train details, running days, origin, and destination',
              action: 'Get train by number',
            },
            {
              name: 'Search Trains by Name',
              value: 'searchByName',
              description: 'Search trains by partial train name query (e.g. Rajdhani)',
              action: 'Search trains by name',
            },
            {
              name: 'Get Cancelled Trains',
              value: 'getCancelled',
              description: 'Get real-time list of today cancelled and diverted trains',
              action: 'Get cancelled trains',
            },
          ],
          default: 'search',
          noDataExpression: true,
        },

        // Operations: Stations & Timetables
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          displayOptions: {
            show: {
              resource: ['stations'],
            },
          },
          options: [
            {
              name: 'Search Stations Autocomplete',
              value: 'searchStations',
              description: 'Search station codes and city names with autocomplete',
              action: 'Search stations autocomplete',
            },
            {
              name: 'Get Station Details by Code',
              value: 'getByCode',
              description: 'Get detailed station metadata, state, and railway division',
              action: 'Get station details by code',
            },
            {
              name: 'Get Station Timetable by Date',
              value: 'getTimetable',
              description: 'Get all trains passing through a station on a given date',
              action: 'Get station timetable by date',
            },
          ],
          default: 'searchStations',
          noDataExpression: true,
        },

        // Operations: Engine Health
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          displayOptions: {
            show: {
              resource: ['health'],
            },
          },
          options: [
            {
              name: 'Get Engine Health',
              value: 'getHealth',
              description: 'Check irctc.dev Rail Engine health and uptime status',
              action: 'Get engine health',
            },
          ],
          default: 'getHealth',
          noDataExpression: true,
        },

        // Parameters: PNR Number
        {
          displayName: 'PNR Number',
          name: 'pnrNumber',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['pnr'],
              operation: ['check'],
            },
          },
          default: '',
          required: true,
          description: 'The 10-digit Indian Railways PNR number (e.g. 2265248473)',
        },

        // Parameters: Train Number
        {
          displayName: 'Train Number',
          name: 'trainNumber',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['liveStatus', 'trains'],
              operation: ['getStatus', 'getAvailability', 'getChartVacant', 'getFare', 'getSchedule', 'getByNumber'],
            },
          },
          default: '',
          required: true,
          description: 'The 4-5 digit train number (e.g. 12557 or 12309)',
        },

        // Parameters: Train Name Query
        {
          displayName: 'Train Name',
          name: 'trainName',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['trains'],
              operation: ['searchByName'],
            },
          },
          default: '',
          required: true,
          description: 'Train name query (minimum 2 characters, e.g. "Rajdhani" or "Garib Rath")',
        },

        // Parameters: Station Code
        {
          displayName: 'Station Code',
          name: 'stationCode',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['liveStatus', 'stations'],
              operation: ['getStationBoard', 'getByCode', 'getTimetable'],
            },
          },
          default: 'NDLS',
          required: true,
          description: 'Station code (e.g. NDLS for New Delhi, PNBE for Patna)',
        },

        // Parameters: Station Search Query
        {
          displayName: 'Station Search Query',
          name: 'stationQuery',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['stations'],
              operation: ['searchStations'],
            },
          },
          default: '',
          required: true,
          description: 'Search string for station code or city name (e.g. "delhi" or "NDLS")',
        },

        // Parameters: From Station Code
        {
          displayName: 'From Station Code',
          name: 'fromStation',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['trains'],
              operation: ['search', 'getAvailability', 'getFare'],
            },
          },
          default: 'NDLS',
          required: true,
          description: 'Origin station code (e.g. NDLS)',
        },

        // Parameters: To Station Code
        {
          displayName: 'To Station Code',
          name: 'toStation',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['trains'],
              operation: ['search', 'getAvailability', 'getFare'],
            },
          },
          default: 'PNBE',
          required: true,
          description: 'Destination station code (e.g. PNBE)',
        },

        // Parameters: Boarding Station (for Chart Vacant)
        {
          displayName: 'Boarding Station Code',
          name: 'boardingStation',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['trains'],
              operation: ['getChartVacant'],
            },
          },
          default: 'GKP',
          required: true,
          description: 'Boarding station code for online reservation chart (e.g. GKP or NKE)',
        },

        // Parameters: Date
        {
          displayName: 'Date',
          name: 'date',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['liveStatus', 'trains', 'stations'],
              operation: ['getStatus', 'search', 'getAvailability', 'getChartVacant', 'getTimetable'],
            },
          },
          default: '',
          required: false,
          description: 'Journey date (YYYY-MM-DD for search/live/chart/timetable, DD-MM-YYYY for availability)',
        },

        // Parameters: Travel Class
        {
          displayName: 'Travel Class',
          name: 'travelClass',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['trains'],
              operation: ['getAvailability', 'getChartVacant', 'getFare'],
            },
          },
          default: '3A',
          required: false,
          description: 'Class filter (e.g. 1A, 2A, 3A, 3E, SL, ALL)',
        },

        // Parameters: Quota
        {
          displayName: 'Booking Quota',
          name: 'quota',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['trains'],
              operation: ['getAvailability', 'getFare'],
            },
          },
          default: 'GN',
          required: false,
          description: 'Quota code (GN for General, TQ for Tatkal, PT for Premium Tatkal)',
        },
      ],
    };
  }

  async execute(context) {
    const ctx = (this && (typeof this.getNodeParameter === 'function' || typeof this.getInputData === 'function'))
      ? this
      : (this?.executeFunctions || context?.executeFunctions || context || this);

    const getParam = (paramName, index, fallbackValue = '') => {
      if (typeof ctx.getNodeParameter === 'function') {
        return ctx.getNodeParameter(paramName, index, fallbackValue);
      }
      if (ctx.executeFunctions && typeof ctx.executeFunctions.getNodeParameter === 'function') {
        return ctx.executeFunctions.getNodeParameter(paramName, index, fallbackValue);
      }
      if (this && typeof this.getNodeParameter === 'function') {
        return this.getNodeParameter(paramName, index, fallbackValue);
      }
      return fallbackValue;
    };

    const getCreds = async (credName) => {
      if (typeof ctx.getCredentials === 'function') {
        return await ctx.getCredentials(credName);
      }
      if (ctx.executeFunctions && typeof ctx.executeFunctions.getCredentials === 'function') {
        return await ctx.executeFunctions.getCredentials(credName);
      }
      if (this && typeof this.getCredentials === 'function') {
        return await this.getCredentials(credName);
      }
      return {};
    };

    const checkContinueOnFail = () => {
      if (typeof ctx.continueOnFail === 'function') {
        return ctx.continueOnFail();
      }
      if (ctx.executeFunctions && typeof ctx.executeFunctions.continueOnFail === 'function') {
        return ctx.executeFunctions.continueOnFail();
      }
      if (this && typeof this.continueOnFail === 'function') {
        return this.continueOnFail();
      }
      return false;
    };

    // Safe input extraction: handles both connected inputs and standalone manual execution ("No input connected")
    let items = [{ json: {} }];
    if (typeof ctx.getInputData === 'function') {
      try {
        const inputItems = ctx.getInputData();
        if (Array.isArray(inputItems) && inputItems.length > 0) {
          items = inputItems;
        }
      } catch (_) {
        items = [{ json: {} }];
      }
    } else if (ctx.executeFunctions && typeof ctx.executeFunctions.getInputData === 'function') {
      try {
        const inputItems = ctx.executeFunctions.getInputData();
        if (Array.isArray(inputItems) && inputItems.length > 0) {
          items = inputItems;
        }
      } catch (_) {
        items = [{ json: {} }];
      }
    }

    const returnData = [];
    const credentials = await getCreds('irctcApi');
    let baseUrl = (credentials?.baseUrl || 'https://api.irctc.dev').trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(baseUrl)) {
      baseUrl = 'https://api.irctc.dev';
    }
    const apiKey = credentials?.apiKey || '';

    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'n8n-nodes-irctc/1.0.1',
    };
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = getParam('resource', i);
        const operation = getParam('operation', i);
        let endpoint = '';

        // 1. PNR
        if (resource === 'pnr' && operation === 'check') {
          const pnr = String(getParam('pnrNumber', i, '')).replace(/[\s-]/g, '');
          if (!/^\d{10}$/.test(pnr)) {
            throw new Error('Invalid PNR number. Must be exactly 10 digits.');
          }
          endpoint = `/api/v1/pnr/${encodeURIComponent(pnr)}`;

        // 2. Live Status & Station Board
        } else if (resource === 'liveStatus' && operation === 'getStatus') {
          const trainNo = String(getParam('trainNumber', i, '')).trim();
          const date = getParam('date', i, '');
          const query = date ? `?date=${encodeURIComponent(date)}` : '';
          endpoint = `/api/v1/live/${encodeURIComponent(trainNo)}${query}`;
        } else if (resource === 'liveStatus' && operation === 'getStationBoard') {
          const station = String(getParam('stationCode', i, '')).trim().toUpperCase();
          endpoint = `/api/v1/live/station/${encodeURIComponent(station)}?hours=2`;

        // 3. Trains & Fares
        } else if (resource === 'trains' && operation === 'search') {
          const from = String(getParam('fromStation', i, '')).trim().toUpperCase();
          const to = String(getParam('toStation', i, '')).trim().toUpperCase();
          const date = getParam('date', i, '');
          const query = date ? `&date=${encodeURIComponent(date)}` : '';
          endpoint = `/api/v1/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}${query}`;
        } else if (resource === 'trains' && operation === 'getAvailability') {
          const trainNo = String(getParam('trainNumber', i, '')).trim();
          const from = String(getParam('fromStation', i, '')).trim().toUpperCase();
          const to = String(getParam('toStation', i, '')).trim().toUpperCase();
          const date = String(getParam('date', i, '')).trim();
          const travelClass = String(getParam('travelClass', i, '3A')).trim().toUpperCase();
          const quota = String(getParam('quota', i, 'GN')).trim().toUpperCase();
          endpoint = `/api/v1/trains/${encodeURIComponent(trainNo)}/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&class=${encodeURIComponent(travelClass)}&quota=${encodeURIComponent(quota)}`;
        } else if (resource === 'trains' && operation === 'getChartVacant') {
          const trainNo = String(getParam('trainNumber', i, '')).trim();
          const boardingStation = String(getParam('boardingStation', i, '')).trim().toUpperCase();
          const date = getParam('date', i, '');
          const travelClass = String(getParam('travelClass', i, 'ALL')).trim().toUpperCase();
          const dateParam = date ? `&date=${encodeURIComponent(date)}` : '';
          endpoint = `/api/v1/trains/${encodeURIComponent(trainNo)}/chart-vacant?boardingStation=${encodeURIComponent(boardingStation)}&class=${encodeURIComponent(travelClass)}${dateParam}`;
        } else if (resource === 'trains' && operation === 'getFare') {
          const trainNo = String(getParam('trainNumber', i, '')).trim();
          const from = String(getParam('fromStation', i, '')).trim().toUpperCase();
          const to = String(getParam('toStation', i, '')).trim().toUpperCase();
          const travelClass = String(getParam('travelClass', i, 'all')).trim().toLowerCase();
          const quota = String(getParam('quota', i, 'GN')).trim().toUpperCase();
          endpoint = `/api/v1/trains/${encodeURIComponent(trainNo)}/fare?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&class=${encodeURIComponent(travelClass)}&quota=${encodeURIComponent(quota)}`;
        } else if (resource === 'trains' && operation === 'getSchedule') {
          const trainNo = String(getParam('trainNumber', i, '')).trim();
          endpoint = `/api/v1/trains/${encodeURIComponent(trainNo)}`;
        } else if (resource === 'trains' && operation === 'getByNumber') {
          const trainNo = String(getParam('trainNumber', i, '')).trim();
          endpoint = `/api/v1/trains/number/${encodeURIComponent(trainNo)}`;
        } else if (resource === 'trains' && operation === 'searchByName') {
          const nameQuery = String(getParam('trainName', i, '')).trim();
          endpoint = `/api/v1/trains/search/name?name=${encodeURIComponent(nameQuery)}`;
        } else if (resource === 'trains' && operation === 'getCancelled') {
          endpoint = `/api/v1/trains/cancelled`;

        // 4. Stations & Timetables
        } else if (resource === 'stations' && operation === 'searchStations') {
          const query = String(getParam('stationQuery', i, '')).trim();
          endpoint = `/api/v1/trains/stations?q=${encodeURIComponent(query)}`;
        } else if (resource === 'stations' && operation === 'getByCode') {
          const code = String(getParam('stationCode', i, '')).trim().toUpperCase();
          endpoint = `/api/v1/trains/stations/${encodeURIComponent(code)}`;
        } else if (resource === 'stations' && operation === 'getTimetable') {
          const code = String(getParam('stationCode', i, '')).trim().toUpperCase();
          const date = String(getParam('date', i, '')).trim();
          endpoint = `/api/v1/trains/stations/${encodeURIComponent(code)}/timetable/${encodeURIComponent(date)}`;

        // 5. Engine Health
        } else if (resource === 'health' && operation === 'getHealth') {
          endpoint = `/health`;
        } else {
          throw new Error(`Unsupported resource "${resource}" or operation "${operation}"`);
        }

        const res = await fetch(`${baseUrl}${endpoint}`, {
          method: 'GET',
          headers,
          signal: AbortSignal.timeout(15000),
        });

        const text = await res.text();
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { raw: text };
        }

        if (!res.ok) {
          const errorMsg =
            (typeof data?.error === 'string' ? data.error : data?.error?.message) ||
            data?.message ||
            `HTTP ${res.status} ${res.statusText}`;
          throw new Error(errorMsg);
        }

        if (operation === 'getHealth') {
          returnData.push({
            json: {
              status: data.status || 'up',
              version: data.version || '1.0.2',
            },
          });
        } else {
          returnData.push({ json: data });
        }
      } catch (error) {
        if (checkContinueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

module.exports = { Irctc };
