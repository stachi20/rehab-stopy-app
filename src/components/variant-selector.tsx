import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Variant } from "@/types/exercise"

type Props = {
  prompt: string
  variants: Variant[]
  value: string
  onChange: (id: string) => void
}

export function VariantSelector({ prompt, variants, value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground">{prompt}</div>
      <RadioGroup value={value} onValueChange={onChange} className="gap-2">
        {variants.map((v) => (
          <Label
            key={v.id}
            htmlFor={`v-${v.id}`}
            className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
          >
            <RadioGroupItem id={`v-${v.id}`} value={v.id} />
            <span className="text-base">{v.label}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
