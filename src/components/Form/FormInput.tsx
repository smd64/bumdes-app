import { useFormContext } from 'react-hook-form';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export default function FormInput({ name, label, type = 'text', placeholder }: FormInputProps) {
  const { register } = useFormContext();

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold text-sm">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}
