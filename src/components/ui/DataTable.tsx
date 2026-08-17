'use client';

import { cn } from '@/lib/utils';

interface DataTableProps {
  headers: string[];
  rows: string[][];
  className?: string;
  stickyFirstColumn?: boolean;
}

export function DataTable({
  headers,
  rows,
  className,
  stickyFirstColumn = false,
}: DataTableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto custom-scrollbar rounded-lg border border-be-grey-250',
        className
      )}
    >
      <table className="w-full text-left text-body">
        <thead>
          <tr className="bg-be-yellow-50">
            {headers.map((header, index) => (
              <th
                key={index}
                className={cn(
                  'px-4 py-3 text-be-charcoal-950 font-semibold text-metadata whitespace-nowrap',
                  stickyFirstColumn && index === 0 && 'sticky left-0 bg-be-yellow-50 z-10'
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-be-grey-250 bg-be-white hover:bg-be-cream/50 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    'px-4 py-3 text-be-charcoal-800 whitespace-nowrap',
                    stickyFirstColumn && cellIndex === 0 && 'sticky left-0 bg-be-white z-10 font-medium text-be-charcoal-950'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
