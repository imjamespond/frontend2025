import { testdb } from "@/lib/db/test";

export async function GET() {
  const users = await testdb();
  return Response.json(users);
}
