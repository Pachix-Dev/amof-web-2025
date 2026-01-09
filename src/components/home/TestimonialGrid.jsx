import React from "react";
import styles from "./TestimonialGrid.module.css";

/**
 * Componente para mostrar un grid de videos embebidos de Instagram con información del testimonio
 * @param {Object} props
 * @param {string[]} props.instagramUrls - Lista de URLs de posts de Instagram
 * @param {Array<{name: string, quote: string, quote_en: string, position: string, position_en: string, company: string}>} props.testimonials - Lista de testimonios con nombre y cita relevante
 * @param {string} props.language - Idioma actual (es/en)
 */
const TestimonialGrid = ({ instagramUrls = [], testimonials = [], language = 'es' }) => {
  return (
    <section className={styles.gridSection}>
      <div className={styles.gridContainer}>
        {instagramUrls.map((url, idx) => {
          // Convertir URL de Instagram a formato embebido sin caption
          const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
          const embedUrl = `${baseUrl}/embed/captioned/`;
          const testimonial = testimonials[idx] || {};
          
          // Seleccionar el texto según el idioma
          const quoteText = language === 'en' && testimonial.quote_en 
            ? testimonial.quote_en 
            : testimonial.quote;
          
          // Seleccionar el puesto según el idioma
          const positionText = language === 'en' && testimonial.position_en
            ? testimonial.position_en
            : testimonial.position;
          
          return (
            <div key={idx} className={styles.gridItem}>
              <iframe
                src={embedUrl}
                title={`Instagram testimonial ${idx + 1}`}
                frameBorder="0"
                scrolling="no"
                allow="encrypted-media"
                className={styles.video}
              />
              {testimonial.name && (
                <div className={styles.testimonialInfo}>
                  <div className={styles.testimonialContent}>
                    {quoteText && (
                      <blockquote className={styles.quote}>
                        <svg className={styles.quoteIcon} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                        </svg>
                        {quoteText}
                      </blockquote>
                    )}
                    <div className={styles.authorInfo}>
                      <p className={styles.authorName}>{testimonial.name}</p>
                      {positionText && (
                        <p className={styles.authorPosition}>{positionText}</p>
                      )}
                      {testimonial.company && (
                        <p className={styles.authorCompany}>{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TestimonialGrid;
