import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const SIZE = 48; // default icon size
const MAX = 80;  // hover size
const DIST = 150; // mouse trigger radius

export const Dock = ({ items }: { items: any[] }) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-3 p-3 bg-black/90 rounded-2xl border border-white/10"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}>
      {items.map((it) => <Item key={it.label} mouseX={mouseX} {...it} />)}
    </nav>
  );
};

function Item({ icon: Icon, label, url, mouseX }: any) {
  const ref = useRef<any>(null);
  const [hover, setHover] = useState(false);

  const d = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - b.x - b.width / 2;
  });

  const width = useSpring(useTransform(d, [-DIST, 0, DIST], [SIZE, MAX, SIZE]), { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative">
      <AnimatePresence>
        {hover && (
          <motion.div initial={{ opacity: 0, y: 10, x: "-50%" }} animate={{ opacity: 1, y: -10, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="absolute left-1/2 bottom-full px-2 py-1 bg-zinc-800 text-[10px] text-white rounded">
            {label}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a ref={ref} href={url} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ width, height: width }} className="flex items-center justify-center rounded-xl bg-white/10 transition-colors">
        <Icon className="w-1/2 h-1/2 text-white" />
      </motion.a>
    </div>
  );
}
