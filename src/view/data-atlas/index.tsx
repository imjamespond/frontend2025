import DataMap from "./data-map";
import { useDataMap } from "./service";
import Relationship from "./relationship";
import { useView } from "./context";
import { View } from "./helper";

function FC() {
  useDataMap();
  const view = useView();
  if (view === View.DataMap) return <DataMap />;
  return <Relationship />;
}

export default FC;
