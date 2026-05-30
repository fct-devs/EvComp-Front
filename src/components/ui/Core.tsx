import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95";
  const variants = {
    primary: "bg-white text-slate-900 hover:bg-gray-200",
    secondary: "bg-transparent border border-white text-white hover:bg-white hover:text-slate-900",
    danger: "bg-red-500 text-white hover:bg-red-600",
    glass: "glass text-white hover:bg-white/20"
  };

  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const InputField = ({ label, id, error, ...props }: any) => {
  return (
    <div className="flex flex-col space-y-1 mb-4">
      <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>
      <input
        id={id}
        name={id}
        className={`w-full bg-transparent border rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all ${error ? 'border-red-500' : 'border-gray-600'}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
    </div>
  );
};

export const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`glass-panel p-8 rounded-2xl shadow-2xl ${className}`}>
      {children}
    </div>
  );
};
