// Utility function for conditional classNames (shadcn/ui standard)
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
} 