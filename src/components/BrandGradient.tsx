import React from "react";

const BrandGradient: React.FC = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% 10%, hsl(var(--brand-start)/0.6), transparent 60%)," +
          "radial-gradient(1000px 500px at 80% 20%, hsl(var(--brand-mid)/0.5), transparent 60%)," +
          "radial-gradient(900px 400px at 50% 80%, hsl(var(--brand-end)/0.5), transparent 60%)",
        maskImage:
          "linear-gradient(to bottom, black 20%, black 60%, transparent 100%)",
      }}
    />
  );
};

export default BrandGradient;
