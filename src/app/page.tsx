import DynamicList from "../../components/dynamiclist/dynamicList.client";
import Title from "../../components/title/title";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Title text="Argument Analyser" />
      <DynamicList />
    </main>
  );
}
