const app = require("./app");
const { PORT = 3000 } = process.env;

app.listen(port, () => {
  console.log(`Example app listening on port ${PORT}`);
});
