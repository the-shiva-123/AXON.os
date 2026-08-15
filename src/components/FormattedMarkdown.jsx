import React from 'react';
import Markdown from 'react-markdown';

export const FormattedMarkdown = ({ content, isUser = false }) => {
  if (isUser) {
    return <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs">{content}</div>;
  }

  return (
    <div className="w-full text-xs font-sans leading-relaxed text-gray-900 space-y-2">
      <Markdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-sm font-bold uppercase tracking-wider text-black border-b border-gray-200 pb-1 mt-3 mb-1.5">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs font-bold uppercase tracking-wider text-black mt-2.5 mb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-semibold text-gray-900 mt-2 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2 leading-relaxed text-gray-800 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-2 ml-1 text-gray-800">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-2 ml-1 text-gray-800">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              <span className="inline">{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-black">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-gray-100 text-pink-700 font-mono text-[11px] rounded border border-gray-200">
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-3 my-2 bg-gray-900 text-gray-100 font-mono text-[11px] rounded-md overflow-x-auto border border-gray-800 leading-normal">
                <code>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-black pl-3 py-1 my-2 bg-gray-50 italic text-gray-700">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 border border-gray-200 rounded">
              <table className="w-full text-left border-collapse text-[11px]">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-gray-100 p-2 font-bold uppercase tracking-wider border-b border-gray-200 text-black">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2 border-b border-gray-100 text-gray-800">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
