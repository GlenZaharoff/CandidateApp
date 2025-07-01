const express = require('express');
const cors = require('cors');
const app = express();
const candidatesRoutes = require('./routes/candidates');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // чтобы CV можно было открыть по ссылке

// ✅ подключение всех маршрутов из routes/candidates.js
app.use('/candidates', candidatesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
