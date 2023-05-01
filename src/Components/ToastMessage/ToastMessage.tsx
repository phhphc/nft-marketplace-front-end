import { useRef } from "react";
import { Toast, ToastMessage } from "primereact/toast";

export interface IToastMessageProps {
    toastProps: ToastMessage;
  }

const ToastMessage = ({toastProps}: IToastMessageProps) => {
  console.log('dss', toastProps);
  const toast = useRef<Toast>(null);
  toast.current?.show({
    severity: toastProps.severity,
    summary: toastProps.summary,
    detail: toastProps.detail,
    life: 4000,
  });

  return (
    <div className="toast-message">
      <Toast ref={toast} position="top-center"/>
    </div>
  );
};

export default ToastMessage;
