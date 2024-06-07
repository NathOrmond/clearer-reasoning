import Proposition from "../../components/proposition/proposition";
import Title from "../../components/title/title";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
     <Title text="Argument Analyser" />
     <Proposition 
      buttonText="Analyse"
      description="Enter a proposition to analyse:"
      inputValue=""
     />
    </main>
  );
}
