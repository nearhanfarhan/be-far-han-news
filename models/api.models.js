const fs = require("fs/promises");
const endpoints = require("../endpoints");

async function fetchEndpoints() {
  const data = await fs.readFile("./endpoints.json", "utf8");
  return JSON.parse(data);
}

module.exports = { fetchEndpoints };
