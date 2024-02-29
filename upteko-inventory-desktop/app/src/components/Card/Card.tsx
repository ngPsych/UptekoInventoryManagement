import React from "react";
import styles from "./Card.module.css";

export const Card = ({ imgSrc, title }: { imgSrc: string; title: string }) => {
    return (
        <div className={styles.cardContainer}>
            <img
                className={styles.cardImg}
                src={imgSrc}
            />
            <h1>{title}</h1>
        </div>
    );
};
