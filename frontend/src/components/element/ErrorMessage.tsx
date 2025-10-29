import React, { useState } from 'react';

interface ErrorMessageProps {
  basic: string;
  details?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ basic, details }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b-10 mb-3 rounded-md border-red-700 bg-red-50 p-6 text-sm text-red-700">
      <p>{basic}</p>
      {details && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 block text-xs underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
      {expanded && details && (
        <pre className="mt-2 whitespace-pre-wrap rounded bg-red-100 p-2 text-xs">
          {details}
        </pre>
      )}
    </div>
  );
};

export default ErrorMessage;
