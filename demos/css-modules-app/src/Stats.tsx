import styles from "./Stats.module.css";

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <div className={styles.stat}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export function StatsRow() {
  return (
    <div className={styles.row}>
      <Stat value="1,284" label="Active users" />
      <Stat value="98.5%" label="Uptime" />
      <Stat value="3.2s" label="Avg. response" />
    </div>
  );
}
