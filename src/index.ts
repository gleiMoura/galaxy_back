import app from "./app.js";
import db from "./config/index.js";
import dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT || "5000", () => {
    if(process.env.NODE_ENV !== "test") {
        db.$connect()
            .then(() => console.log("Database is connected!"))
            .catch((err) => console.error("Database connection error:", err));
    }
    console.log(`Server is running on port ${process.env.PORT || 5000}!`);
});

db //show that database is working in node!
