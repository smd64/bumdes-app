import { FormProvider, useForm } from 'react-hook-form';

export default function FormWrapper({
  children,
  onSubmit,
  defaultValues = {},
}: {
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues?: any;
}) {
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
