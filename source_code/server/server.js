import app from "./index.js";

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});