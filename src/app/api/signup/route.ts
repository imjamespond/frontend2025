import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { ResponseError, ResponseOK } from "@/lib/utils/next";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    const user: typeof usersTable.$inferInsert = {
      name: username,
      age: 30,
      email: username + "@example.com",
    };
    await db.insert(usersTable).values(user);
  } catch (e) {
    return ResponseError(e);
  }

  return ResponseOK();
}
