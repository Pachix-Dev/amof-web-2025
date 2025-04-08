"use client";

import { motion, MotionValue, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";
import type { FC } from "react";
import type { ReactNode } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import './styles.css';

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  text: string;
  text_1: string;
  text_2: string;  
}

export const TextReveal: FC<TextRevealProps> = ({ text, className , text_1, text_2}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null); // Referencia para el párrafo
  const inView = useInView(paragraphRef, { once: false, margin: "-150px" }); // Detecta si el párrafo está en pantalla

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const words = text.split(" ");
  return (
    <div ref={targetRef} className={cn("relative z-0 h-[150vh] md:h-[200vh] ", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] justify-center items-center bg-transparent px-[1rem] py-[3rem]"
        }
      >
        <div
          ref={targetRef}
          className={
            "text-center text-2xl md:text-3xl lg:text-6xl font-bold text-white/50 textBanamex"
          }
          style={{}}          
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
                {word === '2025' ? <br /> : '' }
              </Word>
            );
          })}
          <motion.div
            className="mt-10 text-lg md:text-2xl font-normal text-white"
            initial={{ opacity: 0, y: 80 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }} 
            transition={{ duration: 2, ease: "easeOut" }}
            ref={paragraphRef}
          >
            <span dangerouslySetInnerHTML={{__html: text_1}}></span> <br /><br />
            <a href="https://expositor.amofexpo.igeco.mx/" target="_blank" className="text-white hover:text-[#151924] hover:border-[#151924] p-2 border-2 rounded-xl flex justify-center items-center gap-2 mx-auto w-fit">
            {text_2} 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          </motion.div>       
        </div>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className={"absolute opacity-30"}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={"text-white"}
      >
        {children}        
      </motion.span>
    </span>
  );
};
