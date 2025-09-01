import React from 'react';

export interface ConsultationFormValues {
  name: string;
  email: string;
  phone: string;
  time: string;
  date: string;
  location: string;
  question: string;
}

interface ConsultationFormProps {
  values: ConsultationFormValues;
  onChange: (field: keyof ConsultationFormValues, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
  headerText: string;
}

const timeOptions = ['08:00 a.m', '12:00 p.m', '15:00 p.m', '20:00 p.m'];

const locationOptions = ['Myanmar', 'Thailand'];

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  values,
  onChange,
  onSubmit,
  onClose,
  loading = false,
  headerText,
}) => {
  return (
    <form
      className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="text-h2 mb-6 text-center font-bold">{headerText}</h2>
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
      <div className="mb-4">
        <select
          className="w-full rounded border px-3 py-2"
          value={values.time}
          onChange={(e) => onChange('time', e.target.value)}
          required
        >
          <option value="">Booking Time Schedule</option>
          {timeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <input
          className="w-full rounded border px-3 py-2"
          type="date"
          value={values.date}
          onChange={(e) => onChange('date', e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <select
          className="w-full rounded border px-3 py-2"
          value={values.location}
          onChange={(e) => onChange('location', e.target.value)}
          required
        >
          <option value="">Your Location</option>
          {locationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Anything you want to ask?"
          value={values.question}
          onChange={(e) => onChange('question', e.target.value)}
          rows={3}
        />
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

export default ConsultationForm;
