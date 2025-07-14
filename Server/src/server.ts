import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db";
import userRoutes from './api/userRoutes';
import stripeRoutes from './api/stripeRoutes';
import ridesRoutes from './api/ridesRoutes';
import driverRoutes from './api/driversRoutes';
import directionRoutes from './api/directionsRoutes';
import { setupAssociations } from "./models";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/rides', ridesRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/directions', directionRoutes);

const start = async () => {
  try {
    await sequelize.authenticate(); 
    console.log('Connection to the database has been established successfully.');

    setupAssociations();
    
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

start();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

