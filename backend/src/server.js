import { app } from './app.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`⚡ Task Manager Backend API listening on http://localhost:${PORT}`);
});
