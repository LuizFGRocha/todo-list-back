import 'dotenv/config';
import { server } from './server/server.js';
import mongoose from 'mongoose';

mongoose.connect(String(process.env.MONGODB_URI), { dbName: 'todo_list' })
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Error connecting to MongoDB");
  })

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
