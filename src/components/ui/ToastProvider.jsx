// import { createContext, useContext, useState } from 'react';
// import { Snackbar, Alert } from '@mui/material';

// export const ToastContext = createContext(null);

// export const ToastProvider = ({ children }) => {
//   const [toast, setToast] = useState({
//     open: false,
//     message: '',
//     severity: 'info',
//   });

//   const showToast = (message, severity = 'info') => {
//     setToast({ open: true, message, severity });
//   };

//   const closeToast = () => {
//     setToast((prev) => ({ ...prev, open: false }));
//   };

//   return (
//     <ToastContext.Provider value={{ showToast }}>
//       {children}

//       <Snackbar
//         open={toast.open}
//         autoHideDuration={4000}
//         onClose={closeToast}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={closeToast}
//           severity={toast.severity}
//           variant="filled"
//           sx={{ width: '100%' }}
//         >
//           {toast.message}
//         </Alert>
//       </Snackbar>
//     </ToastContext.Provider>
//   );
// };

// export const useToastContext = () => {
//   const ctx = useContext(ToastContext);
//   if (!ctx) {
//     throw new Error('useToastContext must be used inside ToastProvider');
//   }
//   return ctx;
// };
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Snackbar, Alert } from "@mui/material";

/**
 * -----------------------------------------
 * Global Toast Handler (for Axios, utils)
 * -----------------------------------------
 */
let toastHandler = null;

export const registerToast = (fn) => {
  toastHandler = fn;
};

export const showGlobalToast = (
  message,
  severity = "info"
) => {
  if (toastHandler) {
    toastHandler(message, severity);
  } else {
    console.warn("Toast handler not registered yet:", message);
  }
};

/**
 * -----------------------------------------
 * Toast Context
 * -----------------------------------------
 */
export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (message, severity = "info") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  /**
   * Register toast handler for global usage
   */
  useEffect(() => {
    registerToast(showToast);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Snackbar
        open={toast.open}
        autoHideDuration={8000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

/**
 * -----------------------------------------
 * Hook for React Components
 * -----------------------------------------
 */
export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToastContext must be used inside ToastProvider");
  }
  return ctx;
};
