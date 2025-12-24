// import { getLazyComponent } from "@components/lazyComponent";
import React, { useMemo } from "react";
import DataAtlas from "./data-atlas"
// const DataAtlas = getLazyComponent(() => import("./data-atlas"));

function FC() {
  const view = useMemo(() => <DataAtlas />, []);
  return <React.Fragment>{view}</React.Fragment>;
}

export default FC;
