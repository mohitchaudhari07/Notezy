import { useState } from "react";

export function useResource() {
  // Custom hook for resources
  const [resources] = useState([]);
  
  return { resources };
}
