import app from './app.js';
import env from './config/env.js';

const PORT = env.PORT;

app.listen(
  PORT,
  '0.0.0.0',
  () => {

    console.log(
      `✅ Backend running on port ${PORT}`
    );

  }
);