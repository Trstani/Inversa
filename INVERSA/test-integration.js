/**
 * INVERSA Integration Test
 * Test: User Registration & Project Creation
 * 
 * Scenario:
 * 1. Register user "Lena"
 * 2. Register user "Udin"
 * 3. Lena login and create a project
 * 4. Verify data in Supabase
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
  lena: {
    name: 'Lena',
    email: 'lena@inversa.com',
    password: 'Lena123456!',
  },
  udin: {
    name: 'Udin',
    email: 'udin@inversa.com',
    password: 'Udin123456!',
  },
};

const testProject = {
  title: 'Petualangan Lena',
  description: 'Sebuah cerita tentang petualangan seorang gadis bernama Lena di dunia fantasi',
  category_id: 'novel',
  genre_id: 'adventure',
};

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

    // Debug log
    if (!response.ok && endpoint === '/projects') {
      console.log(`\n[DEBUG] ${method} ${endpoint}`);
      console.log(`Status: ${response.status}`);
      console.log(`Response:`, JSON.stringify(data, null, 2));
      console.log(`Token: ${token?.substring(0, 30)}...`);
    }

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

async function testRegisterUser(userData) {
  log.info(`Registering user: ${userData.name} (${userData.email})`);

  const response = await makeRequest('POST', '/auth/register', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  if (response.success) {
    log.success(`User ${userData.name} registered successfully`);
    log.data(`  Email: ${userData.email}`);
    log.data(`  User ID: ${response.data.user?.id}`);
    return response.data.user;
  } else if (response.data.message === 'Email already registered') {
    log.warn(`User ${userData.name} already registered, skipping...`);
    log.data(`  Email: ${userData.email}`);
    // Try to login to get user data
    const loginResponse = await testLoginUser(userData);
    if (loginResponse) {
      return { email: userData.email };
    }
    return null;
  } else {
    log.error(`Failed to register ${userData.name}`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

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

async function testCreateProject(projectData, token) {
  log.info(`Creating project: ${projectData.title}`);

  const response = await makeRequest('POST', '/projects', projectData, token);

  if (response.success) {
    log.success(`Project created successfully`);
    log.data(`  Title: ${projectData.title}`);
    log.data(`  Project ID: ${response.data.project?.id}`);
    log.data(`  Category: ${projectData.category_id}`);
    log.data(`  Genre: ${projectData.genre_id}`);
    return response.data.project;
  } else {
    log.error(`Failed to create project`);
    log.data(`  Status: ${response.status}`);
    log.data(`  Response: ${JSON.stringify(response.data)}`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

async function testGetProjects() {
  log.info(`Fetching all projects`);

  const response = await makeRequest('GET', '/projects');

  if (response.success) {
    log.success(`Projects fetched successfully`);
    log.data(`  Total projects: ${response.data.projects?.length || 0}`);
    
    if (response.data.projects && response.data.projects.length > 0) {
      log.data(`\n  Projects list:`);
      response.data.projects.forEach((project, index) => {
        log.data(`    ${index + 1}. ${project.title} (ID: ${project.id})`);
        log.data(`       Initiator: ${project.initiator_id}`);
        log.data(`       Created: ${new Date(project.created_at).toLocaleString()}`);
      });
    }
    
    return response.data.projects;
  } else {
    log.error(`Failed to fetch projects`);
    log.data(`  Error: ${response.data.message || response.error}`);
    return null;
  }
}

// ============ MAIN TEST FLOW ============

async function runTests() {
  log.header('INVERSA INTEGRATION TEST');
  log.info(`API Base URL: ${API_BASE_URL}`);
  log.info(`Test started at: ${new Date().toLocaleString()}\n`);

  try {
    // Step 1: Register Lena
    log.header('STEP 1: Register User Lena');
    const lenaUser = await testRegisterUser(testUsers.lena);
    if (!lenaUser) {
      log.error('Cannot continue without Lena user');
      return;
    }

    // Step 2: Register Udin
    log.header('STEP 2: Register User Udin');
    const udinUser = await testRegisterUser(testUsers.udin);
    if (!udinUser) {
      log.error('Cannot continue without Udin user');
      return;
    }

    // Step 3: Login Lena
    log.header('STEP 3: Login User Lena');
    const lenaToken = await testLoginUser(testUsers.lena);
    if (!lenaToken) {
      log.error('Cannot continue without Lena token');
      return;
    }

    // Step 4: Lena creates a project
    log.header('STEP 4: Lena Creates Project');
    const project = await testCreateProject(testProject, lenaToken);
    if (!project) {
      log.error('Cannot continue without project');
      return;
    }

    // Step 5: Fetch all projects to verify
    log.header('STEP 5: Verify Data in Database');
    const projects = await testGetProjects();

    // Summary
    log.header('TEST SUMMARY');
    log.success('All tests completed!');
    log.data(`\n📊 Results:`);
    log.data(`  ✅ Lena registered (ID: ${lenaUser.id})`);
    log.data(`  ✅ Udin registered (ID: ${udinUser.id})`);
    log.data(`  ✅ Lena logged in`);
    log.data(`  ✅ Project created (ID: ${project.id})`);
    log.data(`  ✅ Total projects in database: ${projects?.length || 0}`);

    log.info(`\n🔍 Next steps:`);
    log.data(`  1. Check Supabase dashboard to verify data`);
    log.data(`  2. Look for users: Lena, Udin, Tristan`);
    log.data(`  3. Look for project: "${testProject.title}"`);
    log.data(`  4. Verify relationships between users and projects`);

  } catch (error) {
    log.error(`Test failed with error: ${error.message}`);
    console.error(error);
  }

  log.info(`\nTest completed at: ${new Date().toLocaleString()}`);
}

// ============ RUN TESTS ============
runTests();
