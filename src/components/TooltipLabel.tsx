import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TooltipLabelProps {
  htmlFor: string;
  label: string;
  tooltip: string;
  symbol?: string;
}

export default function TooltipLabel({ htmlFor, label, tooltip, symbol }: TooltipLabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {label}
      {symbol && <span className="ml-1 italic">{symbol}</span>}
      <span className="relative inline-block ml-1 group">
        <AlertCircle className="h-4 w-4 text-gray-400 inline" />
        <span className="invisible group-hover:visible absolute z-10 w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded-md -left-20 top-full">
          {tooltip}
        </span>
      </span>
    </label>
  );
}