process.env.NEXT_TELEMETRY_DISABLED = process.env.NEXT_TELEMETRY_DISABLED || '1';
process.argv.splice(2, 0, 'dev');

require('next/dist/bin/next');
