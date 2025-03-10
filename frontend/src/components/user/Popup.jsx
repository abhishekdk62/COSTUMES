// AlertDialog.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AlertDialog({
  title = "Notification",
  message = "Your action has been processed successfully. The changes have been saved to our system.",
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const closeAlert = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Auto-dismiss after the specified time

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm"
        onClick={closeAlert}
      />
      <div className="relative z-50 w-full max-w-md bg-white shadow-xl rounded-none border-0">
        <button
          onClick={closeAlert}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-xl font-light tracking-wide text-gray-800 uppercase">
            {title}
          </h2>
        </div>
        <div className="px-8 py-6">
          <p className="text-gray-600 font-light leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
