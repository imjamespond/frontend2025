import DataMap from "./data-map";
import { useDataMap } from "./service";
import Relationship from "./relationship";
import { useView } from "./context";
import { View } from "./helper";
// import { Test } from "@components/GlowSpinExpand";

function FC() {
  useDataMap();
  const view = useView();
  // return <Test/>
  if (view === View.DataMap) return <DataMap />;
  return <Relationship />;
}

export default FC;
