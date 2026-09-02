#!/usr/bin/env node
/**
 * Pre-deployment environment checker
 * Run: node scripts/pre-deploy-check.js
 */

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

const OPTIONAL = [
  'OPENAI_API_KEY',
  'GITHUB_TOKEN',
  'NEXT_PUBLIC_GITHUB_USERNAME',
  'TWITTER_CONSUMER_SECRET',
  'LINKEDIN_CLIENT_SECRET',
  'WEBHOOK_SECRET_TOKEN',
];

let allGood = true;

console.log('\n🔍 BC Portfolio — Pre-deployment Environment Check\n' + '='.repeat(50));

console.log('\n✅ REQUIRED VARIABLES:');
REQUIRED.forEach(key => {
  const val = process.env[key];
  if (!val) {
    console.log(`  ❌ MISSING: ${key}`);
    allGood = false;
  } else if (val.includes('your-') || val.includes('change-this')) {
    console.log(`  ⚠️  PLACEHOLDER: ${key} (update before deploy)`);
    allGood = false;
  } else {
    console.log(`  ✓  ${key}`);
  }
});

console.log('\n⚙️  OPTIONAL VARIABLES:');
OPTIONAL.forEach(key => {
  const val = process.env[key];
  console.log(`  ${val ? '✓ ' : '○ '} ${key}${!val ? ' (not set — feature disabled)' : ''}`);
});

if (!allGood) {
  console.log('\n❌ Fix the issues above before deploying.\n');
  process.exit(1);
} else {
  console.log('\n✅ All required variables are set. Ready to deploy!\n');
}
