import { createStyles } from "antd-style";

export const useStyles = createStyles(() => ({
  root: {
    padding: 10,
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    "&> .__item + .__item": {
      marginTop: 10,
    },
    "& .__content": {
      flex: 1,
      overflow: "hidden",
    },
    "& .km-breadcrumb": {
      height: 22,
      "& > ol": {
        listStyle: "none !important",
        "& > li": {
          listStyle: "none !important",
          display: "list-item !important",
        },
      },
    },
  },
}));
