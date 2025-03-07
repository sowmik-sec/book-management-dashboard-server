import app from "./app";
import config from "./app/config";

import mongoose from "mongoose";

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Server is collected");
    app.listen(config.port, () => {
      console.log(`Server is running at port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
