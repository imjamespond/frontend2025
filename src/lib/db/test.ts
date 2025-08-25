// import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { usersTable } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);
export type Params = { insert?: string; update?: number; delete?: boolean };
export async function testdb(props: Params) {
  const name = props.insert ?? "John";
  const user: typeof usersTable.$inferInsert = {
    name,
    age: 30,
    email: name + "@example.com",
  };

  if (props.insert !== undefined) {
    try {
      await db.insert(usersTable).values(user);
      console.log("New user created!");
    } catch (error) {
      console.error("Error inserting user: ", error);
    }
  }

  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  if (props.update) {
    await db
      .update(usersTable)
      .set({
        age: 31,
      })
      .where(eq(usersTable.id, props.update));
    console.log("User info updated!");
  }

  if (props.delete) {
    await db.delete(usersTable).where(eq(usersTable.email, user.email));
    console.log("User deleted!");
  }

  return users;
}
