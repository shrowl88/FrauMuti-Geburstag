import { motion } from "framer-motion";
import React from "react";

const GlassCard = React.forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`glass rounded-3xl p-8 md:p-12 ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
