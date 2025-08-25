import { Params, testdb } from "@/lib/db/test";

async function FC({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const data = await testdb(params);

  return <>{JSON.stringify(data)}</>;
}

export default FC;
