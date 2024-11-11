import { db } from "@/lib/db";

export async function removeDbEntry(query: string, id: string) {
    return db.srem(query, id);
}
