import { useEffect } from "react";
import { Spinner as BSpinner } from "react-bootstrap";
import styles from "./spinner.module.css";
export default function Spinner() {
  useEffect(() => {
    const body = document.body;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className={styles.container}>
      <BSpinner className={styles.spin} animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </BSpinner>
    </div>
  );
}
