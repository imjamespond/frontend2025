// const styles =

import { colorPrimary, colorSecodary } from "@config/style";
import { createGlobalStyle } from "antd-style";

export const OrgStyles = createGlobalStyle(() => ({
  ".__container.__data_map": {
    overflow: "hidden",
    width: "100%",
    height: "100%",
    "& .svg": {
      position: "fixed",
      top: 20,
      left: 0,
      right: 0,
      zIndex: 0,
    },
    "& .title": {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      "& > div": {
        backgroundColor: "#fff",
        borderRadius: "20px",
        margin: "0 auto",
        borderWidth: "1px",
        borderStyle: "solid",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        padding: "4px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
    },
    "& .body": {
      position: "fixed",
      top: 40,
      left: 0,
      right: 0,
      zIndex: 2,
      margin: "0px 10px",
      "& .col": {
        "& > div": {
          // backgroundColor: "#fff",
          justifyContent: "center",
          cursor: "pointer",
          display: "flex",
          padding: 5,
          "& .org-name": {
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            // flex: 1
          },
          "& .amount": { flex: 0 },
          "& .more": { fontWeight: "bold" },
        },
      },
      "& .col.matched": {
        "& > div": {
          backgroundColor: colorPrimary,
          color: "#fff",
          // paddingLeft: "3px"
        },
      },
    },
    "& .__left__": {
      color: "#316bcd",
      "& .title > div": { borderColor: "#316bcd", width: "250px" },
    },
    "& .__right__": {
      color: "#4f99f7",
      "& .title > div": { borderColor: "#4f99f7", width: "250px" },
    },
    "& .__block__": {
      color: colorSecodary,
      "& .title > div": { borderColor: colorPrimary, width: "200px" },
    },
  },
}));
