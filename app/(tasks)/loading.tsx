import { Loader } from "lucide-react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="animate-spin flex items-center justify-center h-screen">
      <Loader size={44} />
    </div>
  );
}
