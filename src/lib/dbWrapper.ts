import { db } from "@/lib/db";

export async function removeEntry(query: string, id: string) {
    return db.srem(query, id);
}
