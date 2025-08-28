import { integer, pgTable, varchar, decimal, serial } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customer: varchar("customer", { length: 100 }).notNull(),
  // 数量 (kg)，最多 18 位，小数 7 位
  quantityKg: decimal("quantity_kg", { precision: 18, scale: 4 }).notNull(),
  // 单价 (元/kg)，最多 18 位，小数 2 位
  unitPrice: decimal("unit_price", { precision: 18, scale: 2 }).notNull(),
  // 总价 (元)，最多 18 位，小数 2 位
  totalPrice: decimal("total_price", { precision: 18, scale: 8 }).notNull(),
});
