import React from 'react';

interface ExpectedOutcomeFieldProps {
  value: string;
  onChange: (val: string) => void;
  showValidation: boolean;
}

export function ExpectedOutcomeField({ value, onChange, showValidation }: ExpectedOutcomeFieldProps) {
  const isError = showValidation && !value.trim();

  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-1">
        Expected Outcome <span className="text-danger">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 bg-white border rounded-button focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all min-h-[100px] resize-y ${isError ? 'border-danger' : 'border-border-strong hover:border-text-muted'
          }`}
        placeholder="What is the final result you expect?"
      />
      {isError && (
        <p className="text-xs text-danger mt-1.5 font-medium">
          Required.
        </p>
      )}
    </div>
  );
}
