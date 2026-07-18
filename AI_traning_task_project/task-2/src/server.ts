import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Simple Auth Service running on port ${env.port}`);
});
