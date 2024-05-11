import dbConnect from "./config/database.js";
import "dotenv/config";
import { Parking } from "./models/Parking.js";
import { History } from "./models/History.js";
import parking from "./parking.json" assert { type: "json" };
import { CurrentData } from "./models/CurrentData.js";

const initSlots = async () => {
  try {
    await dbConnect(process.env.DATABASE_URL);
    await Parking.deleteMany();
    await CurrentData.deleteMany();
    await History.deleteMany();
    await CurrentData.collection.drop();
    await Parking.collection.drop();
    await History.collection.drop();
    await Parking.create(parking);
    console.log("slots initialized");
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};

initSlots();
