import { Params, testdb } from "@/lib/db/test";
import List from "./list";

async function FC({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const data = await testdb(params);

  return <><List data={data} /></>;
}

export default FC;
