import styles from "./Card.module.css";

interface CardProps {
  icon: string;
  title: string;
  description: string;
}

export function Card({ icon, title, description }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
