import express from 'express';
import dotenv from 'dotenv';
import statsRoutes from './routes/statsRoutes.js';
import cronJob from './services/cronJob.js';
import connectDB from "./db/db.js";

dotenv.config({ path: './.env' });

const app = express();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("Mongo DB connection failed!!!", error);
  });

app.use(express.json());

app.use('/api/v1', statsRoutes);

cronJob();
