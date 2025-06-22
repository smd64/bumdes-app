import { useFormContext } from 'react-hook-form';

export default function FormCheckbox({ name, label }: { name: string; label: string }) {
  const { register } = useFormContext();

  return (
    <label className="inline-flex items-center space-x-2">
      <input type="checkbox" {...register(name)} className="form-checkbox" />
      <span>{label}</span>
    </label>
  );
}
