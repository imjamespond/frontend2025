import { useView } from "./context";
import DataMap from "./data-map";
import { View } from "./helper";
import Relationship from "./relationship";
import { useDataMap } from "./service";

// import { Test } from "@components/GlowSpinExpand";

function FC() {
  useDataMap();
  const view = useView();
  // return <Test/>
  if (view === View.DataMap) return <DataMap />;
  return <Relationship />;
}

export default FC;
