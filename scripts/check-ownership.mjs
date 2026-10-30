// Run against a local app: node --env-file=.env scripts/check-ownership.mjs
// Creates two temporary accounts in DATABASE_URL and removes them in finally.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const db = new PrismaClient();
const base = process.env.OWNERSHIP_TEST_URL ?? 'http://localhost:3100';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const ids = [];
let checks = 0;
function check(condition, label) {
  assert.ok(condition, label);
  checks++;
  console.log('PASS ' + label);
}
function client() {
  const jar = new Map();
  return async (path, options = {}) => {
    const res = await fetch(base + path, {
      ...options,
      redirect: 'manual',
      headers: {
        cookie: [...jar].map(([k, v]) => k + '=' + v).join('; '),
        ...options.headers,
      },
    });
    for (const c of res.headers.getSetCookie()) {
      const pair = c.split(';')[0];
      const i = pair.indexOf('=');
      jar.set(pair.slice(0, i), pair.slice(i + 1));
    }
    return res;
  };
}
async function login(user, password) {
  const req = client();
  const csrf = await (await req('/api/auth/csrf')).json();
  await req('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      csrfToken: csrf.csrfToken,
      email: user.email,
      password,
      callbackUrl: base,
    }),
  });
  const session = await (await req('/api/auth/session')).json();
  check(session?.user?.id === user.id, 'real credentials session');
  return req;
}
try {
  const password = randomUUID() + 'aA1!';
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = [];
  for (const label of ['a', 'b']) {
    const user = await db.user.create({
      data: {
        email: `ownership-${randomUUID()}-${label}@example.invalid`,
        hashedPassword,
        name: 'Ownership check',
      },
    });
    ids.push(user.id);
    users.push(user);
  }
  const a = await login(users[0], password);
  const b = await login(users[1], password);
  const anon = client();
  const json = { 'Content-Type': 'application/json' };
  async function create(req, path, body) {
    const r = await req(path, {
      method: 'POST',
      headers: json,
      body: JSON.stringify(body),
    });
    check(r.status === 201, 'create own fixture');
    return r.json();
  }
  const pa = await create(a, '/api/projects', { title: 'Ownership A' });
  const pb = await create(b, '/api/projects', {
    title: 'Ownership B',
    ownerId: users[0].id,
  });
  check(pb.ownerId === users[1].id, 'request ownerId cannot override session');
  const tb = await create(b, `/api/projects/${pb.id}/tasks`, {
    title: 'Private task B',
  });
  const list = await (await a('/api/projects')).json();
  check(
    list.some((p) => p.id === pa.id) && !list.some((p) => p.id === pb.id),
    'list excludes B',
  );
  for (const path of [
    `/api/projects/${pb.id}`,
    `/api/projects/${pb.id}/tasks`,
  ]) {
    check((await a(path)).status === 404, 'A refused foreign resource');
    check((await b(path)).status === 200, 'B can read own resource');
    check((await anon(path)).status === 401, 'anonymous API refused');
  }
  for (const path of [`/projects/${pb.id}`, `/projects/${pb.id}/edit`]) {
    const denied = await a(path);
    const body = await denied.text();
    check(
      (denied.status === 404 ||
        body.includes('NEXT_HTTP_ERROR_FALLBACK;404')) &&
        !body.includes('Ownership B') &&
        !body.includes('Private task B'),
      'A refused project page ' + (path.endsWith('edit') ? 'edit' : 'detail'),
    );
    const own = await b(path);
    check(
      own.status === 200 && (await own.text()).includes('Ownership B'),
      'B can render own page',
    );
    const out = await anon(path);
    check(
      [302, 303, 307, 308].includes(out.status) &&
        out.headers.get('location')?.includes('/login'),
      'anonymous page redirects to login',
    );
  }
  for (const [method, path, body] of [
    ['PATCH', `/api/projects/${pb.id}`, { title: 'tampered' }],
    ['DELETE', `/api/projects/${pb.id}`],
    ['POST', `/api/projects/${pb.id}/tasks`, { title: 'tampered' }],
    [
      'PATCH',
      `/api/tasks/${tb.id}`,
      { title: 'tampered', status: 'COMPLETED' },
    ],
    ['DELETE', `/api/tasks/${tb.id}`],
  ]) {
    const options = {
      method,
      headers: json,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };
    check(
      (await a(path, options)).status === 404,
      'cross-account ' + method + ' refused',
    );
    check(
      (await anon(path, options)).status === 401,
      'anonymous ' + method + ' refused',
    );
  }
  const after = await db.project.findUnique({
    where: { id: pb.id },
    include: { tasks: true },
  });
  check(
    after.title === 'Ownership B' &&
      after.tasks.length === 1 &&
      after.tasks[0].title === 'Private task B' &&
      after.tasks[0].status === 'TODO',
    'B records unchanged after attack attempts',
  );
  console.log(`RESULT ${checks} checks passed`);
} finally {
  try {
    if (ids.length) {
      await db.user.deleteMany({ where: { id: { in: ids } } });
      console.log('Temporary accounts and cascading fixtures removed');
    }
  } finally {
    await db.$disconnect();
  }
}
