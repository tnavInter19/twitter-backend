import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import fileUpload from "express-fileupload";
import * as swaggerUI from "swagger-ui-express";
import { connectToDatabase } from "./database/db_connect";
import { populateInterestsCollection } from "./database/populate_interests";
import { errorHandlerMiddleware } from "./middleware/error_handler";
import { RegisterRoutes } from "./routes/routes";
import * as swaggerJson from "./tsoa/tsoa.json";

//! DOT ENV
dotenv.config();
const app = express();

//!
//! LIST OF EVERYTHING THE APP USES
//! MIDDLE WARE FOR PARSING JSON
app.use(urlencoded({ extended: true }));
app.use(json());

//! SWAGGER UI
//! SERVING SWAGGER UI
app.use(
  ["/openapi", "/docs", "/swagger"],
  swaggerUI.serve,
  swaggerUI.setup(swaggerJson)
);

//! SERVE SWAGGER  JSON
app.get("/swagger.json", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(__dirname + "/tsoa/tsoa.json");
});

//! FILE UPLOADING SERVICE
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

RegisterRoutes(app);

//! ERROR HANDLER
app.use(errorHandlerMiddleware);

const port = process.env.PORT || process.env.BACKUP_PORT;

const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    console.log("Connecting to database...");

    await connectToDatabase(mongoUri);

    console.log("Connected to database");

    await populateInterestsCollection();

    console.log("Starting server...");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
