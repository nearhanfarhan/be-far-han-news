const fs = require("fs/promises");

exports.getEndpoints = (request, response, next) => {
  return fs.readFile("./endpoints.json", "utf8").then((data)=>{
  return JSON.parse(data)})
.then((endpoints) => {
    response.status(200).send(endpoints);
  });
};
