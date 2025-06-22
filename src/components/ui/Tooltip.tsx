export default function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
        {label}
      </div>
    </div>
  );
}
