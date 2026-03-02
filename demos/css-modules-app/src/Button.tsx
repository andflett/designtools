import styles from "./Button.module.css";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({ variant = "primary", children }: ButtonProps) {
  const className = `${styles.button} ${variant === "secondary" ? styles.secondary : styles.primary}`;
  return <button className={className}>{children}</button>;
}

export function ButtonActions({ children }: { children: React.ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}
