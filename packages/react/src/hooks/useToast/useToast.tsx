import { ReactNode } from "react";

import toast, { ToastPosition } from "react-hot-toast";

import Alert from "../../components/Alert/Alert";

export interface CustomToastOptions {
  isDismissible?: boolean;
  position?: ToastPosition;
  duration?: number;
}

export default function useToast() {
  const toasts = {
    success: (message: string | ReactNode, options?: CustomToastOptions) =>
      toast.custom(
        <Alert
          type="success"
          isToast={true}
          isDismissible={options?.isDismissible}
          className="mb-12"
        >
          {message}
        </Alert>,
        { duration: options?.duration, position: options?.position },
      ),
    error: (message: string | ReactNode, options?: CustomToastOptions) =>
      toast.custom(
        <Alert
          type="danger"
          isToast={true}
          isDismissible={options?.isDismissible}
          className="mb-12"
        >
          {message}
        </Alert>,
        { duration: options?.duration, position: options?.position },
      ),
    info: (message: string | ReactNode, options?: CustomToastOptions) =>
      toast.custom(
        <Alert
          type="info"
          isToast={true}
          isDismissible={options?.isDismissible}
          className="mb-12"
        >
          {message}
        </Alert>,
        { duration: options?.duration, position: options?.position },
      ),
    warning: (message: string | ReactNode, options?: CustomToastOptions) =>
      toast.custom(
        <Alert
          type="warning"
          isToast={true}
          isDismissible={options?.isDismissible}
          className="mb-12"
        >
          {message}
        </Alert>,
        { duration: options?.duration, position: options?.position },
      ),
    loading: toast.loading,
  };

  return toasts;
}
