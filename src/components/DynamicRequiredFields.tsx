import React from 'react';

interface DynamicRequiredFieldsProps {
  requiredInputs: string[];
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
  showValidation: boolean;
}

export function DynamicRequiredFields({ requiredInputs, values, onChange, showValidation }: DynamicRequiredFieldsProps) {
  if (!requiredInputs || requiredInputs.length === 0) {
    return (
      <div className="p-4 bg-surface rounded-md text-sm text-text-secondary border border-border-subtle text-center">
        No specific information required for this category.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {requiredInputs.map((input) => {
        const val = values[input] || '';
        const isError = showValidation && !val.trim();

        return (
          <div key={input}>
            <label className="block text-sm font-semibold text-primary mb-1 capitalize">
              {input} <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={val}
              onChange={(e) => onChange(input, e.target.value)}
              className={`w-full p-2.5 bg-white border rounded-button focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all ${isError ? 'border-danger' : 'border-border-strong hover:border-text-muted'
                }`}
              placeholder={`Enter ${input.toLowerCase()}...`}
            />
            {isError && (
              <p className="text-xs text-danger mt-1.5 font-medium">
                Required.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
