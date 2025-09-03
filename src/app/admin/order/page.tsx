"use client";

import { post, useMut } from "@/lib/api";
import { Input } from "@/lib/components/input";
import { ordersTable } from "@/lib/db/schema";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function FC() {
  const { data: session } = useSession();
  const [order, ordering] = useOrderSubmit();
  const { data: orders, isValidating: ordersLoading, mutate: ordersReload } = useOrders();
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { quantityKg, unitPrice } = e.currentTarget;
          if (!session?.user?.email) return;
          await order({
            customer: session.user.email,
            quantityKg: quantityKg.value,
            unitPrice: unitPrice.value,
            totalPrice: "0",
          });
          ordersReload();
        }}
      >
        <Input name={"quantityKg"} label="Quantity (kg)" type="number" step="0.0001" />
        <br />
        <Input name={"unitPrice"} label="Unit Price (元/kg)" type="number" step="0.01" />
        <br />
        <button type="submit" disabled={ordering}>
          Submit
        </button>
      </form>
      <hr />
      <ul>
        {orders?.map((order) => (
          <li key={order.id}>{JSON.stringify(order)}</li>
        ))}
      </ul>
      <button disabled={ordersLoading} onClick={() => ordersReload()}>
        Reload
      </button>
    </>
  );
}

const useOrderSubmit = () => {
  return useMut<typeof ordersTable.$inferInsert>("/api/admin/order", async (key, { arg }) => {
    await post(key, { body: arg });
  });
};

const useOrders = () =>
  useSWR<(typeof ordersTable.$inferSelect)[]>("/api/admin/orders", async () =>
    (await fetch("/api/admin/order")).json()
  );
