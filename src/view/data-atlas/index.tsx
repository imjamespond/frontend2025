import React from "react";
import DataMap from "./data-map";
import { useDataMap } from "./service";

function FC() {
  useDataMap();
  return (
    <React.Fragment>
      <DataMap />
    </React.Fragment>
  );
}

export default FC;
