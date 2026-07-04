import { CheckCircle2 } from "lucide-react";

export function SuccessState({
  title = "Your Exobod interest request has been received.",
  description = "We will follow up over email with next steps for preorder interest and prototype alignment.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-6 py-8 text-center">
      <CheckCircle2 className="h-10 w-10 text-success" aria-hidden />
      <div className="space-y-2">
        <p className="text-lg font-semibold text-text-main">{title}</p>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
    </div>
  );
}
