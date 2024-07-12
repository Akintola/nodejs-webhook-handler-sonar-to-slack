const express = require('express');
const sonarqubeRouter = require('./routes/sonarqube');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/sonarqube', sonarqubeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});