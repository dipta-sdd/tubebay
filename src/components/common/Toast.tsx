import React, { useEffect, useState, FC } from "react";

import { Toast as ToastType } from "../../store/toast/use-toast";
import { close, Icon } from "@wordpress/icons";

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: number) => void;
}
export const Toast: FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // 300ms animation
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000); // 5 seconds
    return () => {
      clearTimeout(timer);
    };
  }, [toast.id]);
  const toastClasses = `toast toast--${toast.type} ${
    isClosing ? "toast--closing" : ""
  }`;

  return (
    <div className={toastClasses}>
      <p className="tubebay-margin-0 tubebay-text[14px] tubebay-leading-1.5 tubebay-flex-1 ">
        {toast.message}
      </p>
      <button
        className="tubebay-bg-none tubebay-border-none tubebay-text-inherit tubebay-opacity-60 hover:tubebay-opacity-100 tubebay-cursor-pointer tubebay-text[20px] tubebay-leading-1 tubebay-px[5px] tubebay-self-start tubebay-mt[-5px] tubebay-mr[-5px] tubebay-mb[-5px] tubebay-ml-0"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        <Icon icon={close} />
      </button>
    </div>
  );
};

export default Toast;
