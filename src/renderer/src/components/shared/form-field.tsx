import { Label } from '@/components/ui/label'

type FormFieldProps = {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean // shows a red * after the label
  children: React.ReactNode
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children
}: FormFieldProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
