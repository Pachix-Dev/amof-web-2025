import React from "react";
import styles from "./TestimonialGrid.module.css";

/**
 * Componente para mostrar un grid de videos embebidos de Instagram
 * @param {Object} props
 * @param {string[]} props.instagramUrls - Lista de URLs de posts de Instagram (ej: https://www.instagram.com/p/CODE/)
 */
const TestimonialGrid = ({ instagramUrls = [] }) => {
  return (
    <section className={styles.gridSection}>
      <div className={styles.gridContainer}>
        {instagramUrls.map((url, idx) => {
          // Convertir URL de Instagram a formato embebido
          const embedUrl = url.endsWith('/') ? `${url}embed` : `${url}/embed`;
          
          return (
            <div key={idx} className={styles.gridItem}>
              <iframe
                src={embedUrl}
                title={`Instagram testimonial ${idx + 1}`}
                frameBorder="0"
                scrolling="no"
                allowTransparency="true"
                allow="encrypted-media"
                className={styles.video}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TestimonialGrid;
