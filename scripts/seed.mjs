import { getPgpClient } from '../app/lib/db';
import { users, employees, projects, cost_segments, payroll_cycles, work_segments } from '../app/lib/placeholder-data.js';
import bcrypt from 'bcrypt';

const db = getPgpClient();

async function seedUsers(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "users" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        return client.query(`
        INSERT INTO users (id, name, email, password)
        VALUES ('${user.id}', '${user.name}', '${user.email}', '${hashedPassword}')
        ON CONFLICT (id) DO NOTHING;
      `);
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return { createTable, /* users: insertedUsers */ };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedEmployees(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "employees" table if it doesn't exist
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      is_active bit NOT NULL,
      created_by UUID REFERENCES users,
      created TIMESTAMP DEFAULT NOW(),
      modified_by UUID REFERENCES users,
      modified TIMESTAMP DEFAULT NOW()
  );
`);

    console.log(`Created "employees" table`);

    // Insert data into the "employees" table
    const insertedEmployees = await Promise.all(
      employees.map(
        (employee) => client.query(`
        INSERT INTO employees (id, name, is_active, created_by, modified_by)
        VALUES ('${employee.id}', '${employee.name}', CAST(${employee.is_active} AS bit), '${employee.created_by}', '${employee.modified_by}')
        ON CONFLICT (id) DO NOTHING;
      `),
      ),
    );

    console.log(`Seeded ${insertedEmployees.length} employees`);

    return { createTable, employees: insertedEmployees };
  } catch (error) {
    console.error('Error seeding employees:', error);
    throw error;
  }
}

async function seedProjects(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "projects" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(25) NOT NULL,
        start_date date,
        end_date date,
        is_active bit NOT NULL,
        created_by UUID REFERENCES users,
        created TIMESTAMP DEFAULT NOW(),
        modified_by UUID REFERENCES users,
        modified TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log(`Created "projects" table`);

    // Insert data into the "projects" table
    const insertedProjects = await Promise.all(
      projects.map(
        (project) => client.query(`
        INSERT INTO projects (id, name, start_date, end_date, is_active, created_by, modified_by)
        VALUES ('${project.id}', '${project.name}', `+
        (project.start_date ? `'${project.start_date}'`: `null`) + ',' +
        (project.end_date ? `'${project.end_date}'`: `null`) + ',' +
        `CAST(${project.is_active} AS bit), '${project.created_by}', '${project.modified_by}')
        ON CONFLICT (id) DO NOTHING;
      `),
      ),
    );

    console.log(`Seeded ${insertedProjects.length} projects`);

    return { createTable, projects: insertedProjects };
  } catch (error) {
    console.error('Error seeding projects:', error);
    throw error;
  }
}

async function seedCost_segments(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "cost_segments" table if it doesn't exist
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS cost_segments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        project_id UUID REFERENCES projects,
        employee_id UUID REFERENCES employees,
        cost_per_hour numeric(12,2),
        cost_currency VARCHAR(5),
        hours_per_day time,
        created_by UUID REFERENCES users,
        created TIMESTAMP DEFAULT NOW(),
        modified_by UUID REFERENCES users,
        modified TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log(`Created "cost_segments" table`);

    // Insert data into the "cost_segments" table
    const insertedProjects = await Promise.all(
      cost_segments.map(
        (cost) => client.query(`
        INSERT INTO cost_segments (project_id, employee_id, cost_per_hour, cost_currency, created_by, modified_by)
        VALUES ('${cost.project_id}', '${cost.employee_id}', ${cost.cost_per_hour * 100}, '${cost.cost_currency}', '${cost.created_by}', '${cost.modified_by}')
      `),
      ),
    );

    console.log(`Seeded ${insertedProjects.length} cost_segments`);

    return { createTable, cost_segments: insertedProjects };
  } catch (error) {
    console.error('Error seeding projects:', error);
    throw error;
  }
}

async function seedPayroll_cycles(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "payroll_cycles" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS payroll_cycles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        start_date date,
        end_date date,
        created_by UUID REFERENCES users,
        created TIMESTAMP DEFAULT NOW(),
        modified_by UUID REFERENCES users,
        modified TIMESTAMP DEFAULT NOW()
      );
    `);
    // month VARCHAR(4) NOT NULL UNIQUE,
    // work_segments INT NOT NULL

    console.log(`Created "payroll_cycles" table`);

    // Insert data into the "payroll_cycles" table
    const insertedWork_segments = await Promise.all(
      payroll_cycles.map(
        (cycle) => client.query(`
        INSERT INTO payroll_cycles (id, start_date, end_date, created_by, modified_by)
        VALUES ('${cycle.id}', '${cycle.start_date}', '${cycle.end_date}', '${cycle.created_by}', '${cycle.modified_by}')
        ON CONFLICT (id) DO NOTHING;
      `),
      ),
    );

    console.log(`Seeded ${insertedWork_segments.length} payroll_cycles`);

    return { createTable, /* work_segments: insertedWork_segments */ };
  } catch (error) {
    console.error('Error seeding payroll_cycles:', error);
    throw error;
  }
}

async function seedWork_segments(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "work_segments" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS work_segments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        project_id UUID REFERENCES projects,
        employee_id UUID REFERENCES employees,
        start_date date,
        end_date date,
        hours_per_day time,
        payroll_cycle_id UUID REFERENCES payroll_cycles,
        created_by UUID REFERENCES users,
        created TIMESTAMP DEFAULT NOW(),
        modified_by UUID REFERENCES users,
        modified TIMESTAMP DEFAULT NOW()
      );
    `);
    // work_date date,
    // start_time time,
    // end_time time,
    // minutes_per_day interval minute,

    console.log(`Created "work_segments" table`);

    // Insert data into the "work_segments" table
    const insertedWork_segments = await Promise.all(
      work_segments.map(
        (segment) => client.query(`
        INSERT INTO work_segments (id, project_id, employee_id, start_date, end_date, hours_per_day, payroll_cycle_id, created_by, modified_by)
        VALUES ('${segment.id}', '${segment.project_id}', '${segment.employee_id}', '${segment.start_date}', '${segment.end_date}', '${segment.hours_per_day}', '${segment.payroll_cycle_id}', '${segment.created_by}', '${segment.modified_by}')
        ON CONFLICT (id) DO NOTHING;
      `),
      ),
    );

    console.log(`Seeded ${insertedWork_segments.length} work_segments`);

    return { createTable, /* work_segments: insertedWork_segments */ };
  } catch (error) {
    console.error('Error seeding work_segments:', error);
    throw error;
  }
}

async function main() {

  // await seedUsers(db);
  // await seedProjects(db);
  // await seedEmployees(db);
  await seedCost_segments(db);
  // await seedPayroll_cycles(db);
  // await seedWork_segments(db);

  // await db.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
