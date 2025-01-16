const app = require('./app');
const PORT = process.env.TODO_BACKEND_PORT

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
