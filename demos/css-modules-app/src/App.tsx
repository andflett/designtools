/**
 * Demo app for CSS Modules styling.
 * Tests Surface's Phase 1c (CSS Modules write adapter).
 *
 * Every component imports its own .module.css file and uses styles.foo notation.
 * Surface should resolve styles.foo → .foo in the module file and write CSS there.
 */
import styles from "./App.module.css";
import { Card, CardGrid } from "./Card";
import { StatsRow } from "./Stats";
import { Button, ButtonActions } from "./Button";

export default function App() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Surface CSS Modules Demo</h1>
        <p className={styles.subtitle}>
          Scoped styles via .module.css — each component owns its CSS
        </p>
      </header>

      <StatsRow />

      <h2 className={styles.title} style={{ fontSize: "20px", marginBottom: "16px" }}>
        Features
      </h2>
      <CardGrid>
        <Card
          icon="⚡"
          title="Scoped Styles"
          description="Each component's CSS is locally scoped — no class name collisions."
        />
        <Card
          icon="🎨"
          title="Direct Edits"
          description="Surface writes to .module.css files when you edit element styles."
        />
        <Card
          icon="🔧"
          title="No Runtime"
          description="CSS Modules are resolved at build time. Zero JavaScript overhead."
        />
      </CardGrid>

      <h2 className={styles.title} style={{ fontSize: "20px", marginBottom: "16px" }}>
        Actions
      </h2>
      <ButtonActions>
        <Button variant="primary">Save changes</Button>
        <Button variant="secondary">Cancel</Button>
      </ButtonActions>
    </div>
  );
}
