import Diagram from "./diagram";
import Search from "./search";
import { useStyles } from "./styles";

function FC() {
  const { styles } = useStyles();
  return (
    <div className={styles.root}>
      <Search />
      <Diagram />
    </div>
  );
}

export default FC;
