interface SidebarSectionProps {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}

export default function SidebarSection({ title, collapsed, children }: SidebarSectionProps) {
  return (
    <div className="mb-4">
      {!collapsed && (
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase select-none dark:text-gray-400">
          {title}
        </h3>
      )}
      <div>{children}</div>
    </div>
  );
}
