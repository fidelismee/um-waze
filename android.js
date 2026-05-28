const { spawn } = require('child_process');

const proc = spawn('npx', ['expo', 'start', '--android'], {
  stdio: 'inherit',
  shell: true,
});

proc.on('close', (code) => process.exit(code ?? 0));
