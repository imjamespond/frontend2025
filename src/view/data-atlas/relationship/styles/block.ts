import { colorPrimary } from "@config/style";
import { createGlobalStyle, createStyles } from "antd-style";

export type BlockStyles = {
  bg: string;
  bg0: string;
  bg1: string;
  bg2: string;
  bg3: string;
  color: string;
};
export const useStyles = createStyles(() => ({
  root: {
    height: "100%",
    overflowX: "hidden", // or padx 抵消 row gutter
    overflowY: "auto",
    position: "relative",
    // minWidth: 1000, // 非react window
    // "& > div > div > div > div":{
    //   minWidth: 1000 // row width
    // },
    "& .km-card-body": {
      // fontFamily: "'Arial Negreta', 'Arial Normal', 'Arial'",
      minHeight: "165px",
      fontSize: "14px",
    },
  },
}));

const styles = {
  bg: colorPrimary,
  bg3: "#fff",
  color: "hsl(358, 71%, 25%)",
};
export const BlockStyles = createGlobalStyle(() => {
  const { bg, color } = styles;
  return {
    "& .Dir": {
      background: `linear-gradient(to left bottom, ${bg}22 0%, ${bg}05 30%);`,
      color: `${color}`,
      cursor: "pointer",
      borderRadius: "8px",
      height: "100%",
      "& .km-card-body": { padding: "12px 16px" },
      "& .__icon1__": {
        position: "absolute",
        bottom: "0",
        right: "0",
        img: { height: "100px", width: "150px" },
      },
      "&:hover": {
        // backgroundImage: `linear-gradient(to left top, ${bg2}, ${bg3})`,
        boxShadow: "3px 3px 5px 0px rgb(0 0 0 / 0.1)",
      },
      "& .__dirName__": {
        fontSize: "22px",
        fontWeight: 700,
        fontStyle: "normal",
      },
      "& .__count__": { fontSize: "16px" },
    },
    "& .Table": {
      background: `linear-gradient(to bottom, ${bg}99 50%, ${bg}33 100%);`,
      color: "#393a3c",
      cursor: "pointer",
      borderColor: "#e0e0e0",
      borderRadius: "8px",
      height: "100%",
      position: "relative",
      "& .km-card-body": { padding: "10px 90px 10px 10px" },
      "&:hover": {
        borderColor: "#a4d3ff",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },
      "& .__title__": { fontSize: "16px", fontWeight: 700, fontStyle: "normal", paddingRight: 0 },
      "& .__desc__": { fontSize: "13px", fontStyle: "normal", paddingTop: "5px", paddingRight: 0 },
      "& .__bottom__": { position: "absolute", bottom: "5px", left: "10px" },
      "& .__icons__": {
        "& > img": { height: "24px" },
        "& > img+img": { marginLeft: "10px" },
      },
      "& .__rate__": {
        fontSize: "12px",
        "& .km-rate": {
          marginLeft: "5px",
          // color: bg1,
          "& svg": { width: "12px", height: "12px" },
        },
        "& .km-rate-star:not(:last-child)": { marginRight: "2px" },
      },
    },
  };
});
