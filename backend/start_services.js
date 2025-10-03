const { spawn } = require('child_process');
const path = require('path');

console.log('Starting MedAid services...');

// Start Python service
const pythonService = spawn('python3', ['medical_analyzer.py'], {
  cwd: path.join(__dirname, 'python_service'),
  stdio: 'inherit'
});

pythonService.on('error', (error) => {
  console.error('Failed to start Python service:', error);
});

pythonService.on('close', (code) => {
  console.log(`Python service exited with code ${code}`);
});

// Wait a moment for Python service to start
setTimeout(() => {
  // Start Node.js backend
  console.log('Starting Node.js backend...');
  require('./server.js');
}, 5000);