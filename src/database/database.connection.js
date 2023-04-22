import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const mongoCilent = new MongoClient(process.env.DATABASE_URL);

try {
    await mongoCilent.connect()
} catch (err) {
    console.log(err.message);
}
export const db = mongoCilent.db()
