import { useFormContext } from 'react-hook-form';

interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export default function FormSelect({ name, label, options }: FormSelectProps) {
  const { register } = useFormContext();

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold text-sm">{label}</label>
      <select {...register(name)} className="w-full border border-gray-300 rounded px-3 py-2">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
