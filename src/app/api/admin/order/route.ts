import { db } from "@/lib/db";
import { ordersTable } from "@/lib/db/schema";
import { ResponseData, ResponseError, ResponseOK } from "@/lib/utils/next";
import { eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // const searchParams = request.nextUrl.searchParams;
    const { customer, quantityKg, unitPrice, totalPrice } = await request.json();

    const item: typeof ordersTable.$inferInsert = {
      customer,
      quantityKg,
      unitPrice,
      totalPrice,
    };

    const items = await db.insert(ordersTable).values(item).returning();

    {
      const item = items[0];
      await db
        .update(ordersTable)
        .set({ totalPrice: sql`${ordersTable.quantityKg} * ${ordersTable.unitPrice}` })
        .where(eq(ordersTable.id, item.id));
    }
  } catch (e) {
    return ResponseError(e);
  }

  return ResponseOK();
}

export async function GET() {
  const items = await db.select().from(ordersTable);
  return ResponseData(items);
}
