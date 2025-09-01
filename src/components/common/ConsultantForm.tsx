import React from 'react';

export interface ConsultantFormValues {
  name: string;
  email: string;
  phone: string;
  reason: string;
}

interface ConsultantFormProps {
  values: ConsultantFormValues;
  onChange: (field: keyof ConsultantFormValues, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
}

const ConsultantForm: React.FC<ConsultantFormProps> = ({
  values,
  onChange,
  onSubmit,
  onClose,
  loading = false,
}) => {
  return (
    <form
      className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="text-h2 mb-6 text-center font-bold">
        Join our teams as a consultant
      </h2>
      <div className="mb-4">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Name"
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          type="email"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Phone Number"
          value={values.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Why do you want to join?(Tell us about your university name, your contribution, etc.)"
          value={values.reason}
          onChange={(e) => onChange('reason', e.target.value)}
          rows={3}
          required
        />
      </div>
      <div className="text-text-secondary mb-4 text-xs">
        * We will contact you for further more details via email
      </div>
      <button
        type="submit"
        className="bg-primary hover:bg-primary/90 w-full rounded py-2 font-semibold text-white transition-colors"
        disabled={loading}
      >
        Submit
      </button>
    </form>
  );
};

export default ConsultantForm;
