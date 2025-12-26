import { createStyles } from "antd-style";

export const useStyles = createStyles((/* { css } */) => {
  return {
    root: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "rgb(249, 252, 255)",

      "& .__search": {
        paddingTop: 10,
        paddingBottom: 15,
      },

      "& .brandLG": {
        "& > div": {
          width: "100px",
          padding: "2px 8px",
          color: "#fff",
          fontSize: "12px",
          textAlign: "center",
          border: "1px solid transparent",
          borderRadius: "3px",
          transform: "translate(-10px, 30px) rotateZ(328deg) skewX(330deg)",
        },
      },
      "& .brandSM": {
        "& > div": {
          width: "80px",
          padding: "2px 8px",
          color: "#fff",
          fontSize: "10px",
          textAlign: "center",
          border: "1px solid transparent",
          borderRadius: "3px",
          transform: "scale(0.92) translate(2px, 8px) rotateZ(328deg) skewX(330deg)",
        },
      },

      "& .brand": { backgroundColor: "#196ad2" },
      "& .brand.highlight": { backgroundColor: "#ffb800" },
    },
  };
});

export const useSearchTabsStyles = createStyles((/* { css } */) => {
  return {
    root: {
      backgroundColor: "#fff",
      borderRadius: "2px",
      boxShadow: "0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)",

      "& .__close": {
        position: "relative",
        "& .km-btn ": { position: "absolute", right: 20, top: 10, zIndex: 999 },
      },

      "& .matchedItem em ": {
        color: "rgb(255, 85, 0)",
      },

      "& .km-tabs": {
        padding: "0 10px",
      },

      "& .km-list": {
        maxHeight: "420px",
        overflow: "auto",
      },

      "& .km-list-item": {
        "& .km-list-item-meta": {
          paddingLeft: "10px",
          paddingRight: "10px",
        },

        "&:hover": {
          backgroundColor: "#eeeeee",
        },

        "& .km-typography.km-typography-secondary > div": {
          "&:hover": {
            color: "#0069ac",
          },
        },
      },
    },
  };
});