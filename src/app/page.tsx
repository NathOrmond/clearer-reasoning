import { Box, Link, Typography } from "@mui/material";
import Title from "../../components/title/title";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main} style={{ display: 'flex', height: '100vh' }}>
      <Title text="Argument Analyser - Pages Under Construction" />
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, gap: 2 }}>
        <Link
         sx={{fontSize: '1.5rem'}}
         href="/bayesian"
        >
          Bayesian Representation
        </Link>
        <Link 
         sx={{fontSize: '1.5rem'}}
         href="/propositional"
        >
          Propositional Logic
        </Link>
      </Box>
    </main>
  );
}