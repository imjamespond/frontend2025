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

    "& .x6-node": {
      "& .ring": { opacity: 0 },
      "&:hover": {
        "& .ring": {
          stroke: "rgb(106, 198, 255) !important",
          opacity: 0.3,
        },
      },
    },
    "& .x6-node.selected": {
      "& .ring": { stroke: "rgb(253, 204, 89)", opacity: 0.3 },
    },
    "& .x6-edge": {
      "&:hover": { "& .outline": { strokeOpacity: 0.15 } },
    },
    "& .x6-node.x6-node path.context-menu-item": {
      strokeWidth: "2px",
      fill: "rgb(210, 213, 218)",
    },
    "& .x6-node.x6-node path.context-menu-item:hover": {
      cursor: "pointer",
      fontSize: "14px",
      fill: "rgb(185, 185, 185)",
    },
    "& .x6-node.x6-node .context-menu-item": { cursor: "pointer" },
  },
}));
