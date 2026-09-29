const http = require('http');

const getEndpoints = [
  { path: '/', expectJson: false, name: 'Main Dashboard' },
  { path: '/slides', expectJson: false, name: 'Pitch Deck' },
  { path: '/approve', expectJson: false, name: 'DuploCloud Approval Gate' },
  { path: '/demo', expectJson: false, name: 'Cinema Video Walkthrough' },
  { path: '/api/state', expectJson: true, name: 'Live Merchant State' },
  { path: '/api/band/room', expectJson: true, name: 'Band Room pier48-rush' },
  { path: '/api/crusoe/status', expectJson: true, name: 'Crusoe Clean Telemetry' },
  { path: '/api/plaud/status', expectJson: true, name: 'Plaud NotePin S Status' },
  { path: '/api/neo4j/graph', expectJson: true, name: 'Neo4j 18-Node Graph' },
  { path: '/api/wholesale/quote', expectJson: true, name: 'Wholesale B2B Quote Engine' }
];

const postEndpoints = [
  {
    path: '/api/plaud/process',
    body: { transcript: 'Freezer room check: 12 strawberry, 65 mango ready.' },
    name: 'Plaud Voice Extraction'
  },
  {
    path: '/api/rehearse/chaos',
    body: { crisis: 'STRAWBERRY_DEPLETED' },
    name: 'Chaos Rehearsal Simulation'
  },
  {
    path: '/api/approve',
    body: { signature: 'maker-brandon-verified' },
    name: 'DuploCloud 1-Click Approval'
  },
  {
    path: '/api/wholesale/accept',
    body: { quoteId: 'WHQ-MUN89201' },
    name: 'Wholesale Order Acceptance'
  }
];

function request(options, data = null) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });
    req.on('error', (err) => {
      resolve({ statusCode: 500, error: err.message });
    });
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runHealthCheck() {
  console.log('================================================================');
  console.log('🐙 DREAMNETIOPI SYSTEM HEALTH & VIBE AUDIT');
  console.log('Verifying all server endpoints, proofs, and interactions');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  console.log('--- 1. Testing GET Endpoints & Pages ---');
  for (const ep of getEndpoints) {
    total++;
    const res = await request({
      hostname: 'localhost',
      port: 4242,
      path: ep.path,
      method: 'GET'
    });

    let ok = res.statusCode === 200;
    let jsonOk = true;
    if (ep.expectJson) {
      try {
        JSON.parse(res.body);
      } catch (e) {
        jsonOk = false;
      }
    }

    if (ok && jsonOk) {
      passed++;
      console.log(`✅ [200 OK]  ${ep.path.padEnd(24)} -> ${ep.name}`);
    } else {
      console.error(`❌ [${res.statusCode}] ${ep.path.padEnd(24)} -> ${ep.name} (Error: ${res.error || 'bad format'})`);
    }
  }

  console.log('\n--- 2. Testing POST Mutation & Workflow Actions ---');
  for (const ep of postEndpoints) {
    total++;
    const res = await request({
      hostname: 'localhost',
      port: 4242,
      path: ep.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, ep.body);

    let ok = res.statusCode === 200;
    let jsonOk = true;
    try {
      JSON.parse(res.body);
    } catch (e) {
      jsonOk = false;
    }

    if (ok && jsonOk) {
      passed++;
      console.log(`✅ [200 OK]  ${ep.path.padEnd(24)} -> ${ep.name}`);
    } else {
      console.error(`❌ [${res.statusCode}] ${ep.path.padEnd(24)} -> ${ep.name} (Error: ${res.error || 'bad format'})`);
    }
  }

  console.log('\n================================================================');
  console.log(`AUDIT RESULT: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================');

  if (passed === total) {
    console.log('🌟 EVERYTHING IS VIBING AND WORKING 100% PERFECTLY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed. Review logs above.\n');
    process.exit(1);
  }
}

runHealthCheck();
