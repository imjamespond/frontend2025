import { Params, testdb } from "@/lib/db/test";
import List from "./list";

async function FC({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;

  // https://nextjs.org/docs/app/guides/single-page-applications#spas-with-swr
  const data = new Promise((resolve) => {
    setTimeout(resolve, 30_000);
  }).then(async () => await testdb(params));

  return (
    <>
      <List users={data} />
    </>
  );
}

export default FC;
