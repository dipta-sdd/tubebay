import { FC } from "react";
import { useToast } from "../../store/toast/use-toast";
import { Toast } from "./Toast";

export const ToastContainer: FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      id="kkkkkkk"
      className="tubebay-fixed tubebay-bottom-[20px] tubebay-right-[20px] tubebay-z-[999999] tubebay-flex tubebay-flex-col-reverse tubebay-gap-[10px] tubebay-min-w-[300px]"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};
