import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { ResponseError, ResponseOK } from "@/lib/utils/next";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { email, username } = await request.json();
    const action = searchParams.get("action");
    if (action === "delete") {
      await db.delete(usersTable).where(eq(usersTable.email, email));
    }

    if (action === "create") {
      const user: typeof usersTable.$inferInsert = {
        name: username,
        age: 30,
        email: username + "@example.com",
      };
      await db.insert(usersTable).values(user);
    }

    console.log({ action });
  } catch (e) {
    return ResponseError(e);
  }

  return ResponseOK();
}
