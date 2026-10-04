// Phase 6: seed synthetic demo accounts for local development/browser
// verification of authentication and role-aware routing.
//
// Usage:  node scripts/seed-demo-users.js   (MongoDB must be running)
//
// Creates (idempotently, in the development database):
//   hr@demo.com           HR Demo User        (recruiter)   + recruiter profile
//   interviewer@demo.com  Interviewer Demo    (interviewer)
//   candidate@demo.com    Candidate Demo      (interviewee) + candidate profile
// All demo passwords: Demo123456 (hashed with scrypt; plaintext never stored).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { connectDatabase, closeDatabase } from '../backend/src/config/database.js';
import { ensureBaselineIndexes } from '../backend/src/db/indexes.js';
import { hashPassword } from '../backend/src/auth/password.js';
import { toBackendRole } from '../backend/src/auth/roles.js';
import { createUser, createRecruiter, createCandidate, findUserByEmail } from '../backend/src/db/persistence.js';

const rootDir = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const raw = readFileSync(join(rootDir, '../backend/.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2];
      }
    }
  } catch {
    // fall back to defaults (local MongoDB on 127.0.0.1:27017)
  }
}

const DEMO_USERS = [
  { name: 'HR Demo User', email: 'hr@demo.com', password: 'Demo123456', productRole: 'hr', company: 'Demo Corp' },
  { name: 'Interviewer Demo', email: 'interviewer@demo.com', password: 'Demo123456', productRole: 'interviewer' },
  { name: 'Candidate Demo', email: 'candidate@demo.com', password: 'Demo123456', productRole: 'interviewee' },
];

async function seed() {
  loadEnv();
  const db = await connectDatabase();
  if (!db) {
    console.error('[seed] MongoDB is not reachable. Start MongoDB and retry.');
    process.exit(1);
  }
  await ensureBaselineIndexes(db);

  for (const demo of DEMO_USERS) {
    const existing = await findUserByEmail(demo.email);
    if (existing) {
      console.log(`[seed] ${demo.email} already exists (skipped)`);
      continue;
    }
    const backendRole = toBackendRole(demo.productRole);
    const passwordHash = await hashPassword(demo.password);
    const user = await createUser({ name: demo.name, email: demo.email, passwordHash, role: backendRole });
    if (backendRole === 'recruiter') {
      await createRecruiter({ userId: user._id, company: demo.company });
    } else if (backendRole === 'candidate') {
      await createCandidate({ userId: user._id });
    }
    console.log(`[seed] created ${demo.email} (${demo.productRole})`);
  }

  await closeDatabase();
  console.log('[seed] done');
}

seed().catch((error) => {
  console.error(`[seed] failed: ${error.message}`);
  process.exit(1);
});
