export default function LoadingSpinner({ size = 6 }: { size?: number }) {
  return (
    <div
      className={`border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}
      style={{ width: size * 4, height: size * 4 }}
      aria-label="Loading"
      role="status"
    />
  );
}
