import { useState } from "react";

export function useAI() {
  // Custom hook for AI features
  const [loading] = useState(false);

  return { loading };
}
