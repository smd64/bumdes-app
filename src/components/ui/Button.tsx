interface ButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
}: ButtonProps) {
  const base = 'px-4 py-2 rounded font-semibold transition';
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-black hover:bg-gray-300';

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
