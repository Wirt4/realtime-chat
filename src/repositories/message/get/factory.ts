import { db } from "@/lib/db";
import { Database } from "@/lib/interfaces/database";

export function getMessageRepositoryFactory(): Database {
    return db;
}
