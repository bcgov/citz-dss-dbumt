import React from 'react';

interface SuccessMessageProps {
  children: React.ReactNode;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ children }) => {
  const baseClasses = 'p-6 rounded-md mb-3 text-sm border-b-4';

  const successClasses = 'bg-[#F6FFF8] text-[#42814A] border-[#42814A]';

  return <div className={`${baseClasses} ${successClasses}`}>{children}</div>;
};

export default SuccessMessage;
