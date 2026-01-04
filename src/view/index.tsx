import { getLazyComponent } from "@components/lazyComponent";
import React, { useMemo } from "react";
const DataAtlas = getLazyComponent(() => import("./data-atlas"));
const MetadataAnaylsis = getLazyComponent(() => import("./metadata-analysis"));

function FC() {
  const view = useMemo(() => {
    // 根据地址结尾
    const pathname = window.location.pathname;
    if (pathname.endsWith("/metadata-analysis")) {
      return <MetadataAnaylsis />;
    }

    return <DataAtlas />;
  }, []);
  return <React.Fragment>{view}</React.Fragment>;
}

export default FC;
