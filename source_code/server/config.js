// export const DATABASE_URI= "mongodb+srv://manikumarchintapali:<db_password>@cluster0.e1wvmho.mongodb.net/drill_practice_db";

// export const MONGO_URI_TEST =
//   "mongodb+srv://manikumarchintapali:<db_password>@cluster0.e1wvmho.mongodb.net/drill_practice_db";

// export const PORT_NUMBER = 8080;

// export const JWT_PRIVATE_KEY = "269ad716d6a608ade7eebff78923ccb4d454226442c85e3ebc9e6702a813d9f021cdf9dafb196f264780f3882595e410a490127586df7083bea543800650667b";
// src/config.js
import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";

export const DATABASE_URI =
  process.env.DATABASE_URI ||
  "mongodb+srv://manikumarchintapali:<db_password>@cluster0.e1wvmho.mongodb.net/drill_practice_db";

export const MONGO_URI_TEST =
  process.env.MONGO_URI_TEST ||
  "mongodb+srv://manikumarchintapali:<db_password>@cluster0.e1wvmho.mongodb.net/drill_practice_db";

export const PORT_NUMBER = parseInt(process.env.PORT, 10) || 8080;

export const JWT_PRIVATE_KEY =
  process.env.JWT_PRIVATE_KEY ||
  "269ad716d6a608ade7eebff78923ccb4d454226442c85e3ebc9e6702a813d9f021cdf9dafb196f264780f3882595e410a490127586df7083bea543800650667b";

export const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  "http://ec2-3-149-242-97.us-east-2.compute.amazonaws.com:5173";