import { FC } from "react";
import { useToast } from "../../store/toast/use-toast";
import { Toast } from "./Toast";

export const ToastContainer: FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="tubebay-fixed tubebay-top-[10px] tubebay-right-[10px] tubebay-z-[999999] tubebay-flex tubebay-flex-col tubebay-gap-[10px] tubebay-min-w-[200px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};
