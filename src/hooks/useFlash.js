// src/hooks/useFlash.js
import { useState, useEffect } from "react";

function useFlash(timeout = 3000) {
  const [flash, setFlash] = useState({ message: "", type: "info" });

  useEffect(() => {
    if (flash.message) {
      const timer = setTimeout(() => {
        setFlash({ message: "", type: "" });
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [flash, timeout]);

  return [flash, setFlash];
}

export default useFlash;
