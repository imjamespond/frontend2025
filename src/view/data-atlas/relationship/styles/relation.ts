import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  root: {
    backgroundColor: "rgb(249, 252, 255)",
    "& .organization": {
      "& .svg": {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
      },
      "& .body": {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        padding: "15px 10px 0px",
        color: token.colorPrimary,
        "& .ant-col": {
          "& > div": {
            border: ".8px solid",
            backgroundColor: "#fff",
            lineHeight: "30px",
            cursor: "pointer",

            borderColor: token.colorPrimary,

            "& .org-name": {
              textAlign: "center",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              margin: " 0 5px",
            },
            "& .more": { fontWeight: "bold", textAlign: "center" },
          },
        },
        "& .ant-col.matched": {
          "& > div": { color: "#fff", backgroundColor: token.colorPrimary },
        },
      },
    },
    "&.__graph__": {
      width: "100%",
      height: "100%",
      position: "relative",
      "& .__category__": {
        fontSize: "16px",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderColor: token.colorPrimary,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: "#fff",
        "&.__title__": {
          color: token.colorPrimary,
        },
        "& > div": {
          margin: "0px 10px",
        },
      },

      "& .__desc__": {
        backgroundColor: "#fff",
        "span + span": { marginLeft: "20px" },
      },
      "& .__dir__": {
        color: token.colorPrimary,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderColor: token.colorPrimary,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        fontSize: "12px",
        cursor: "pointer",
        "& > div": {
          margin: "0px 5px",
        },
        "&.highlight": { color: "#fff", backgroundColor: token.colorPrimary },
      },
    },
  },
}));
