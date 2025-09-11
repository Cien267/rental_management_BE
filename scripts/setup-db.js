const { execSync } = require('child_process');
const path = require('path');

console.log('Setting up database...');

try {
  // Run migrations
  console.log('Running migrations...');
  execSync('npm run db:migrate', { stdio: 'inherit' });

  // Run seeders
  console.log('Running seeders...');
  execSync('npm run db:seed', { stdio: 'inherit' });

  console.log('Database setup completed successfully!');
} catch (error) {
  console.error('Database setup failed:', error.message);
  process.exit(1);
}
