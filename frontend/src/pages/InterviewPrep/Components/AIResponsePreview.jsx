import React, { useState } from 'react';
import { LuCopy, LuCheck, LuCode } from 'react-icons/lu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighLighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AIResponsePreview = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  if (!content) {
    return null;
  }

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeText = String(children).replace(/\n$/, '');
            const index = node.position?.start.line || Math.random();

            if (!inline && match) {
              const language = match[1];

              return (
                <div
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    margin: '1em 0',
                    overflow: 'hidden',
                    fontSize: '0.9em',
                    fontFamily:
                      'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      borderBottom: '1px solid #ddd',
                      padding: '0.3em 0.8em',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '600',
                      fontSize: '0.85em',
                      color: '#333',
                    }}
                  >
                    <span>
                      <LuCode style={{ marginRight: 6 }} />
                      {capitalize(language)}
                    </span>
                    <button
                      onClick={() => handleCopy(codeText, index)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      aria-label="Copy code"
                    >
                      {copiedCode === index ? (
                        <LuCheck color="green" size={20} />
                      ) : (
                        <LuCopy size={20} />
                      )}
                    </button>
                  </div>
                  <SyntaxHighLighter
                    style={oneLight}
                    language={language}
                    PreTag="div"
                    {...props}
                    customStyle={{ margin: 0, padding: '1em' }}
                  >
                    {codeText}
                  </SyntaxHighLighter>
                </div>
              );
            } else {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default AIResponsePreview;




