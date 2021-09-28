const app = require("express")();
const serveStatic = require("serve-static");

app.use(serveStatic(__dirname));
const PORT = 5000;
app.listen(PORT, () => console.log(`server started on ${PORT}`));
