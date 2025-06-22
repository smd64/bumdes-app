interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  title?: string;
}

export default function IconButton({ icon, onClick, title }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {icon}
    </button>
  );
}
