import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const supabaseDir = path.join(rootDir, 'supabase');
const functionsDir = path.join(supabaseDir, 'functions');
const migrationsDir = path.join(supabaseDir, 'migrations');
const packageManager = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const log = (message = '') => console.log(message);
const info = (message) => log(`==> ${message}`);
const success = (message) => log(`✓ ${message}`);
const fail = (message) => {
  console.error(`\nDeployment failed: ${message}`);
  process.exit(1);
};

const run = (label, command, args) =>
  new Promise((resolve, reject) => {
    info(label);

    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', (error) => reject(error));
    child.on('close', (code) => {
      if (code === 0) {
        success(label);
        log();
        resolve();
        return;
      }

      reject(new Error(`${label} exited with code ${code}`));
    });
  });

const getFunctionNames = () => {
  if (!existsSync(functionsDir)) {
    return [];
  }

  return readdirSync(functionsDir)
    .filter((entry) => {
      const functionPath = path.join(functionsDir, entry);
      return statSync(functionPath).isDirectory() && existsSync(path.join(functionPath, 'index.ts'));
    })
    .sort((a, b) => a.localeCompare(b));
};

const stripQuotes = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const ensureEnvEntry = (envPath, key, value) => {
  if (!existsSync(envPath)) {
    writeFileSync(envPath, `${key}=${value}\n`);
    return true;
  }

  const content = readFileSync(envPath, 'utf8');
  const linePattern = new RegExp(`^${key}=.*$`, 'm');

  if (linePattern.test(content)) {
    return false;
  }

  writeFileSync(envPath, `${content.trimEnd()}\n${key}=${value}\n`);
  return true;
};

const validatePaymentEnv = () => {
  const envPath = path.join(rootDir, '.env');
  const requiredEntries = [
    ['PAYMENT_PROVIDER', 'paystack'],
    ['WHATSAPP_NUMBER', ''],
    ['WHATSAPP_DEFAULT_MESSAGE', ''],
  ];

  for (const [key, defaultValue] of requiredEntries) {
    ensureEnvEntry(envPath, key, defaultValue);
  }

  const envContent = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
  const fileEnvMap = new Map(
    envContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !line.startsWith('#'))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        if (separatorIndex === -1) {
          return null;
        }

        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
      })
      .filter(Boolean)
  );

  const envMap = new Map(fileEnvMap);
  for (const [key, value] of Object.entries(process.env)) {
    if (!envMap.has(key)) {
      envMap.set(key, value ?? '');
    }
  }

  const provider = stripQuotes(envMap.get('PAYMENT_PROVIDER') || 'paystack').trim().toLowerCase();
  if (provider !== 'paystack' && provider !== 'whatsapp') {
    fail('Invalid PAYMENT_PROVIDER. Use paystack or whatsapp.');
  }

  if (provider === 'whatsapp') {
    const number = stripQuotes(envMap.get('WHATSAPP_NUMBER')?.trim() || '');
    const message = stripQuotes(envMap.get('WHATSAPP_DEFAULT_MESSAGE')?.trim() || '');

    if (!number) {
      fail('Missing WHATSAPP_NUMBER for whatsapp payment provider.');
    }

    if (!message) {
      fail('Missing WHATSAPP_DEFAULT_MESSAGE for whatsapp payment provider.');
    }
  }

  if (provider === 'paystack') {
    const requiredPaystack = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_CLIENT_URL', 'PAYSTACK_SECRET_KEY'];
    const missing = requiredPaystack.filter((key) => !stripQuotes(envMap.get(key)?.trim() || ''));

    if (missing.length > 0) {
      fail(`Missing required Paystack environment variables: ${missing.join(', ')}.`);
    }
  }

  success(`Payment provider configured: ${provider}`);
  return { provider, envMap };
};

const main = async () => {
  if (!existsSync(supabaseDir)) {
    fail('The supabase directory was not found. Run this command from the project root.');
  }

  const functionNames = getFunctionNames();

  log('Supabase deployment starting');
  log(`Project root: ${rootDir}`);
  log(`Functions discovered: ${functionNames.length ? functionNames.join(', ') : 'none'}`);
  log();

  try {
    const { provider, envMap } = validatePaymentEnv();

    await run('Verify Supabase CLI availability', packageManager, ['exec', '--', 'supabase', '--version']);

    if (provider === 'paystack') {
      const paystackSecretKey = stripQuotes(envMap.get('PAYSTACK_SECRET_KEY'));
      await run('Sync Paystack secret to Supabase', packageManager, [
        'exec',
        '--',
        'supabase',
        'secrets',
        'set',
        `PAYSTACK_SECRET_KEY=${paystackSecretKey}`,
      ]);
    }

    if (existsSync(migrationsDir)) {
      await run('Push database migrations', packageManager, ['exec', '--', 'supabase', 'db', 'push']);
    } else {
      info('No supabase/migrations directory found; skipping database push');
      log();
    }

    for (const functionName of functionNames) {
      await run(`Deploy Edge Function: ${functionName}`, packageManager, [
        'exec',
        '--',
        'supabase',
        'functions',
        'deploy',
        functionName,
      ]);
    }

    success('Supabase deployment completed successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(message);
  }
};

void main();
