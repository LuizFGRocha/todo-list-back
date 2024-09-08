import 'dotenv/config';
import { server } from './server/server.js';
import mongoose from 'mongoose';
import { initializeDatabase } from '../tests/dbHandler.js';

let dbHandler;

if (process.env.NODE_ENV === 'development') {
  dbHandler = await initializeDatabase();
  dbHandler.connect().then(() => {
    console.log("Connected to MongoDB memory server!");
  }).catch(() => {
    console.log("Error connecting to MongoDB memory server!");
  });

} else if (process.env.NODE_ENV === 'production') {
  
  mongoose.connect(String(process.env.MONGODB_URI), { dbName: 'todo_list' })
    .then(async () => {
      console.log("Connected to MongoDB");
    })
    .catch(() => {
      console.log("Error connecting to MongoDB");
    });
} else {
  console.log("Invalid NODE_ENV");
  process.exit(1);
}

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
