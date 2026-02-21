export default function Button({ children, variant = 'primary', type = 'button', className = '', ...props }) {
  const base =
    'inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition whitespace-nowrap ';
  const variants = {
    primary: 'bg-primary text-white hover:bg-red-700',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-red-50',
  };
  return (
    <button type={type} className={base + (variants[variant] || variants.primary) + ' ' + className} {...props}>
      {children}
    </button>
  );
}
