import { useState, useEffect, useRef } from 'react';
import styles from './Testimonials.module.css';
import { FaUserCircle } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const testimonials = [
  {
    id: 1,
    name: 'Elena Cruz',
    role: 'Marketing Manager',
    quote: 'Maeri designs exceeded our expectations. Highly recommended!',
  },
  {
    id: 2,
    name: 'Alexandre Lee',
    role: 'Product Manager',
    quote: "Maeri's attention to detail is unmatched. A true professional!",
  },
  {
    id: 3,
    name: 'Sophie Roberts',
    role: 'Startup Founder',
    quote: 'Maeri transformed our online presence. Incredible results!',
  },
  {
    id: 4,
    name: 'Lucas Moretti',
    role: 'UX Director',
    quote: 'Fantastic communication and beautiful design work!',
  },
  {
    id: 5,
    name: 'María González',
    role: 'CMO',
    quote: 'Increíble ejecución, resultados que se notan en ventas.',
  },
];

const VISIBLE_COUNT = 3;

export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      visible.push(testimonials[(startIndex + i) % testimonials.length]);
    }
    return visible;
  };

  // For infinite scroll in mobile (reset scroll position to simulate loop)
  useEffect(() => {
    const carousel = carouselRef.current;

    const handleScroll = () => {
      const width = carousel.clientWidth;
      const scrollLeft = carousel.scrollLeft;
      const index = Math.round(scrollLeft / width);
      setStartIndex(index % testimonials.length);
    };

    if (isMobile && carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Client Testimonials</h2>
      <div className={styles.carouselWrapper}>
        {!isMobile && (
          <button className={`${styles.arrow} ${styles.left}`} onClick={prevSlide}>
            <IoChevronBack />
          </button>
        )}

        <div className={styles.carousel} ref={carouselRef}>
          {(isMobile ? testimonials : getVisibleTestimonials()).map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className={styles.card}>
              <div className={styles.user}>
                <FaUserCircle className={styles.avatar} />
                <div>
                  <div className={styles.name}>{testimonial.name}</div>
                  <div className={styles.role}>{testimonial.role}</div>
                </div>
              </div>
              <p className={styles.quote}>{testimonial.quote}</p>
            </div>
          ))}
        </div>

        {!isMobile && (
          <button className={`${styles.arrow} ${styles.right}`} onClick={nextSlide}>
            <IoChevronForward />
          </button>
        )}
      </div>

      <div className={styles.dots}>
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === startIndex ? styles.activeDot : ''}`}
            onClick={() => setStartIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
