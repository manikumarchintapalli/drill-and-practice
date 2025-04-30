// import app from "./index.js";

// const PORT = process.env.PORT || 8080;

// const server = app.listen(PORT, () => {
//   console.log("Listening on port", PORT);
// });

// server.js

import { PORT_NUMBER } from "./config.js";
import app from "./index.js";
// import { PORT_NUMBER } from "./src/config.js";

const PORT = PORT_NUMBER;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});