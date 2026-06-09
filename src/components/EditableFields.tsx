import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function FieldShell({ id, label, required, error, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="dq-field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-danger-text">{error}</p>}
    </div>
  );
}

interface EditableFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EditableField({ label, value, onChange, required, error, className = '', ...props }: EditableFieldProps) {
  const id = props.id || `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <input
        {...props}
        id={id}
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`dq-input ${error ? 'dq-input-error' : ''} ${className}`}
      />
    </FieldShell>
  );
}

interface EditableTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EditableTextarea({ label, value, onChange, required, error, className = '', rows = 4, ...props }: EditableTextareaProps) {
  const id = props.id || `textarea-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <textarea
        {...props}
        id={id}
        rows={rows}
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`dq-textarea ${error ? 'dq-input-error' : ''} ${className}`}
      />
    </FieldShell>
  );
}

interface EditableSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  value: string;
  options: Array<string | { label: string; value: string }>;
  onChange: (value: string) => void;
  error?: string;
}

export function EditableSelect({ label, value, options, onChange, required, error, className = '', ...props }: EditableSelectProps) {
  const id = props.id || `select-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <select
        {...props}
        id={id}
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`dq-input ${error ? 'dq-input-error' : ''} ${className}`}>
        {options.map((option) => {
          const normalized = typeof option === 'string' ? { label: option, value: option } : option;
          return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>;
        })}
      </select>
    </FieldShell>
  );
}

export function EditableChipList({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  const addChip = () => {
    const value = window.prompt(`Add ${label.toLowerCase()}`);
    if (value?.trim()) onChange([...values, value.trim()]);
  };

  return (
    <div>
      <div className="dq-field-label">{label}</div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`Remove ${value}`}
            onClick={() => onChange(values.filter((item) => item !== value))}
            className="dq-chip">
            {value}
          </button>
        ))}
        <button type="button" onClick={addChip} className="dq-chip dq-chip-add">+ Add</button>
      </div>
    </div>
  );
}

export interface EditableChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export function EditableChecklist({
  items,
  onToggle,
  onLabelChange,
  onAdd,
}: {
  items: EditableChecklistItem[];
  onToggle: (id: string) => void;
  onLabelChange?: (id: string, label: string) => void;
  onAdd?: () => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <label key={item.id} className="flex items-center gap-2 rounded-button px-1 py-1 text-sm text-primary hover:bg-surface">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggle(item.id)}
            className="h-4 w-4 rounded border-border-default text-secondary focus:ring-secondary/30"
          />
          {onLabelChange ? (
            <input
              value={item.label}
              onChange={(event) => onLabelChange(item.id, event.target.value)}
              className="min-w-0 flex-1 rounded-input border border-transparent bg-transparent px-2 py-1 text-sm outline-none focus:border-border-default focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          ) : (
            <span className={item.completed ? 'text-text-muted line-through' : ''}>{item.label}</span>
          )}
        </label>
      ))}
      {onAdd && <button type="button" onClick={onAdd} className="text-sm font-semibold text-info-text hover:text-primary">+ Add item</button>}
    </div>
  );
}
