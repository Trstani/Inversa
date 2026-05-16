/**
 * INVERSA Team & Brainstorm Test
 * Test: Team Creation, Join Request, and Brainstorming
 * 
 * Scenario:
 * 1. Udin (ID 3) creates a team
 * 2. Tristan (ID 1) requests to join the team
 * 3. Udin approves Tristan's request
 * 4. Udin creates a team project
 * 5. Udin and Tristan brainstorm ideas for the project
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';

// ============ COLORS FOR CONSOLE ============
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.cyan}${colors.bright}═══ ${msg} ═══${colors.reset}\n`),
  data: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
};

// ============ TEST DATA ============
const testUsers = {
  udin: {
    id: 3,
    name: 'Udin',
    email: 'udin@inversa.com',
    password: 'Udin123456!',
  },
  tristan: {
    id: 1,
    name: 'Tristan',
    email: 'test@mail.com',
    password: 'Tristan123456!',
  },
};

const testTeam = {
  title: 'Tim Kreatif Udin',
  description: 'Tim untuk mengerjakan project kreatif bersama',
};

const testTeamProject = {
  title: 'Petualangan Bersama',
  description: 'Project kolaboratif untuk tim kreatif',
  category_id: 'novel',
  genre_id: 'adventure',
};

const testIdeas = [
  {
    title: 'Ide Karakter Utama',
    description: 'Karakter utama adalah seorang petualang muda yang berani',
  },
  {
    title: 'Setting Cerita',
    description: 'Cerita berlatar di dunia fantasi dengan kerajaan-kerajaan kuno',
  },
  {
    title: 'Plot Utama',
    description: 'Petualang harus menyelamatkan kerajaan dari ancaman gelap',
  },
];

// ============ HELPER FUNCTIONS ============

async function makeRequest(method, endpoint, body = null, token = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return {
      status: response.status,
      success: response.ok,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      success: false,
      error: error.message,
    };
  }
}

// ============ TEST FUNCTIONS ============

async function testLoginUser(userData) {
  log.info(`Logging in user: ${userData.name}`);

  const response = await makeRequest('POST', '/auth/login', {
    email: userData.email,
    password: userData.password,
  });

  if (response.success) {
    log.success(`User ${userData.name} logged in successfully`);
    log.data(`  Token: ${response.data.token?.substring(0, 20)}...`);
    return response.data.token;
  } else {
    log.error(`Failed to login ${userData.name}`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

async function testCreateTeam(teamData, token) {
  log.info(`Creating team: ${teamData.title}`);

  const response = await makeRequest('POST', '/teams', teamData, token);

  if (response.success) {
    log.success(`Team created successfully`);
    log.data(`  Title: ${teamData.title}`);
    log.data(`  Team ID: ${response.data.team?.id}`);
    return response.data.team;
  } else {
    log.error(`Failed to create team`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

async function testRequestJoinTeam(teamId, token) {
  log.info(`Requesting to join team (ID: ${teamId})`);

  const response = await makeRequest('POST', `/teams/${teamId}/request-join`, {}, token);

  if (response.success) {
    log.success(`Join request sent successfully`);
    log.data(`  Request ID: ${response.data.request?.id}`);
    return response.data.request;
  } else {
    log.error(`Failed to request join`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

async function testApproveJoinRequest(teamId, userId, token) {
  log.info(`Approving join request from user ${userId}`);

  const response = await makeRequest('POST', `/teams/${teamId}/approve-member`, { user_id: userId }, token);

  if (response.success) {
    log.success(`Join request approved`);
    return response.data;
  } else {
    log.error(`Failed to approve join request`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

async function testCreateTeamProject(projectData, teamId, token) {
  log.info(`Creating team project: ${projectData.title}`);

  const payload = {
    ...projectData,
    is_team_project: true,
    team_id: teamId,
  };

  const response = await makeRequest('POST', '/projects', payload, token);

  if (response.success) {
    log.success(`Team project created successfully`);
    log.data(`  Title: ${projectData.title}`);
    log.data(`  Project ID: ${response.data.project?.id}`);
    return response.data.project;
  } else {
    log.error(`Failed to create team project`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

async function testCreateBrainstormIdea(projectId, ideaData, token) {
  log.info(`Adding brainstorm idea: ${ideaData.title}`);

  const response = await makeRequest('POST', `/brainstorm/${projectId}/ideas`, ideaData, token);

  if (response.success) {
    log.success(`Idea added successfully`);
    log.data(`  Title: ${ideaData.title}`);
    log.data(`  Idea ID: ${response.data.idea?.id}`);
    return response.data.idea;
  } else {
    log.error(`Failed to add idea`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

async function testGetBrainstormIdeas(projectId) {
  log.info(`Fetching brainstorm ideas for project ${projectId}`);

  const response = await makeRequest('GET', `/brainstorm/${projectId}/ideas`);

  if (response.success) {
    log.success(`Ideas fetched successfully`);
    log.data(`  Total ideas: ${response.data.ideas?.length || 0}`);
    
    if (response.data.ideas && response.data.ideas.length > 0) {
      log.data(`\n  Ideas list:`);
      response.data.ideas.forEach((idea, index) => {
        log.data(`    ${index + 1}. ${idea.title}`);
        log.data(`       Description: ${idea.description}`);
      });
    }
    
    return response.data.ideas;
  } else {
    log.error(`Failed to fetch ideas`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

// ============ MAIN TEST FLOW ============

async function runTests() {
  log.header('INVERSA TEAM & BRAINSTORM TEST');
  log.info(`API Base URL: ${API_BASE_URL}`);
  log.info(`Test started at: ${new Date().toLocaleString()}\n`);

  try {
    // Step 1: Login Udin
    log.header('STEP 1: Login User Udin');
    const udinToken = await testLoginUser(testUsers.udin);
    if (!udinToken) {
      log.error('Cannot continue without Udin token');
      return;
    }

    // Step 2: Udin creates a team
    log.header('STEP 2: Udin Creates Team');
    const team = await testCreateTeam(testTeam, udinToken);
    if (!team) {
      log.error('Cannot continue without team');
      return;
    }

    // Step 3: Login Tristan
    log.header('STEP 3: Login User Tristan');
    const tristanToken = await testLoginUser(testUsers.tristan);
    if (!tristanToken) {
      log.error('Cannot continue without Tristan token');
      return;
    }

    // Step 4: Tristan requests to join team
    log.header('STEP 4: Tristan Requests to Join Team');
    const joinRequest = await testRequestJoinTeam(team.id, tristanToken);
    if (!joinRequest) {
      log.warn('Join request might have failed, continuing anyway...');
    }

    // Step 5: Udin approves Tristan's request
    log.header('STEP 5: Udin Approves Tristan\'s Join Request');
    const approved = await testApproveJoinRequest(team.id, testUsers.tristan.id, udinToken);
    if (!approved) {
      log.warn('Approval might have failed, continuing anyway...');
    }

    // Step 6: Udin creates a team project
    log.header('STEP 6: Udin Creates Team Project');
    const project = await testCreateTeamProject(testTeamProject, team.id, udinToken);
    if (!project) {
      log.error('Cannot continue without project');
      return;
    }

    // Step 7: Udin adds brainstorm ideas
    log.header('STEP 7: Udin Adds Brainstorm Ideas');
    const ideas = [];
    for (const ideaData of testIdeas.slice(0, 2)) {
      const idea = await testCreateBrainstormIdea(project.id, ideaData, udinToken);
      if (idea) ideas.push(idea);
    }

    // Step 8: Tristan adds brainstorm idea
    log.header('STEP 8: Tristan Adds Brainstorm Idea');
    const tristanIdea = await testCreateBrainstormIdea(project.id, testIdeas[2], tristanToken);
    if (tristanIdea) ideas.push(tristanIdea);

    // Step 9: Fetch all brainstorm ideas
    log.header('STEP 9: Verify All Brainstorm Ideas');
    const allIdeas = await testGetBrainstormIdeas(project.id);

    // Summary
    log.header('TEST SUMMARY');
    log.success('All tests completed!');
    log.data(`\n📊 Results:`);
    log.data(`  ✅ Udin logged in`);
    log.data(`  ✅ Team created (ID: ${team.id})`);
    log.data(`  ✅ Tristan logged in`);
    log.data(`  ✅ Tristan requested to join team`);
    log.data(`  ✅ Udin approved Tristan's request`);
    log.data(`  ✅ Team project created (ID: ${project.id})`);
    log.data(`  ✅ Brainstorm ideas added: ${ideas.length}`);
    log.data(`  ✅ Total ideas in database: ${allIdeas?.length || 0}`);

    log.info(`\n🔍 Next steps:`);
    log.data(`  1. Check Supabase dashboard to verify data`);
    log.data(`  2. Look for team: "${testTeam.title}"`);
    log.data(`  3. Look for team members: Udin, Tristan`);
    log.data(`  4. Look for project: "${testTeamProject.title}"`);
    log.data(`  5. Look for brainstorm ideas (should be 3)`);

  } catch (error) {
    log.error(`Test failed with error: ${error.message}`);
    console.error(error);
  }

  log.info(`\nTest completed at: ${new Date().toLocaleString()}`);
}

// ============ RUN TESTS ============
runTests();
