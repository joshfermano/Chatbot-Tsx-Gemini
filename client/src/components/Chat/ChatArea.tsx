import { useRef, useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { BsRobot, BsLightningCharge } from 'react-icons/bs';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  loading: boolean;
  onSendMessage?: (message: string) => void;
}

// Sample suggestions for empty state
const SUGGESTIONS = [
  'What courses are offered at UPHSD Molino?',
  'How do I enroll for the next semester?',
  'What are the admission requirements?',
  "Tell me about UPHSD's history",
];

const ChatArea = ({
  messages = [],
  loading = false,
  onSendMessage,
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<number | null>(
    null
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSuggestionClick = (suggestion: string) => {
    if (onSendMessage) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="flex-1 h-[calc(100vh-210px)] overflow-hidden flex flex-col relative">
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 py-8 px-4 md:px-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/80">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-4">
            <div className="relative mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-75 blur-lg"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                <BsRobot className="text-blue-600 dark:text-blue-400 w-14 h-14 md:w-16 md:h-16" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-gray-100 tracking-tight">
              Hi, I'm Perps!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg text-base md:text-lg leading-relaxed mb-8">
              Your AI assistant for the University of Perpetual Help System
              DALTA - Molino Campus. How can I help you today?
            </p>

            {/* Suggestions */}
            <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group shadow-sm hover:shadow"
                  onMouseEnter={() => setHoveredSuggestion(index)}
                  onMouseLeave={() => setHoveredSuggestion(null)}
                  onClick={() => handleSuggestionClick(suggestion)}>
                  <div className="flex items-start">
                    <div
                      className={`text-blue-600 dark:text-blue-400 mt-0.5 mr-2 transition-transform duration-200 ${
                        hoveredSuggestion === index
                          ? 'transform -translate-y-0.5'
                          : ''
                      }`}>
                      <BsLightningCharge size={14} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {suggestion}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-full pt-2">
            <div className="flex-grow"></div>
            <div className="space-y-4 max-w-3xl mx-auto w-full pb-6 pt-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex animate-fadeIn ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } mb-3`}>
                  <div
                    className={`
                    max-w-[85%] md:max-w-[75%] rounded-2xl p-3 shadow-sm
                    ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-tr-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }
                  `}>
                    <div className="flex items-center mb-1 gap-2">
                      {message.role === 'model' ? (
                        <>
                          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                            <BsRobot className="text-indigo-700 dark:text-indigo-300" />
                          </div>
                          <span className="font-medium">Perps</span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">You</span>
                          <div className="p-1.5 bg-blue-500/20 dark:bg-blue-900/40 rounded-full">
                            <FiUser className="text-blue-400 dark:text-blue-300" />
                          </div>
                        </>
                      )}
                    </div>
                    {message.role === 'model' ? (
                      <div className="markdown-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                          components={{
                            p: ({ node, ...props }) => (
                              <p
                                className="mb-3 last:mb-0 leading-relaxed"
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc pl-5 mb-3 space-y-1"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal pl-5 mb-3 space-y-1"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="mb-1" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold" {...props} />
                            ),
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-xl font-bold my-3"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-lg font-bold my-2"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-md font-bold my-2"
                                {...props}
                              />
                            ),
                            code: ({
                              node,
                              inline,
                              ...props
                            }: { node?: any; inline?: boolean } & any) =>
                              inline ? (
                                <code
                                  className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm"
                                  {...props}
                                />
                              ) : (
                                <code
                                  className="block bg-gray-100 dark:bg-gray-700 p-3 rounded-lg my-3 overflow-x-auto font-mono text-sm"
                                  {...props}
                                />
                              ),
                          }}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-fadeIn mb-3">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 rounded-tl-none max-w-[85%] md:max-w-[75%] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                        <BsRobot className="text-indigo-700 dark:text-indigo-300" />
                      </div>
                      <span className="font-medium">Perps</span>
                    </div>
                    <div className="mt-3">
                      {/* Typing animation indicator */}
                      <div className="typing-animation flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full bg-indigo-500 animate-typing-dot"
                            style={{ animationDelay: '0ms' }}></div>
                          <div
                            className="w-2 h-2 rounded-full bg-indigo-500 animate-typing-dot"
                            style={{ animationDelay: '200ms' }}></div>
                          <div
                            className="w-2 h-2 rounded-full bg-indigo-500 animate-typing-dot"
                            style={{ animationDelay: '400ms' }}></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                          Generating response...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-6" />
            </div>
          </div>
        )}
      </div>
      {/* Add keyframe animations to the global scope */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes typing-dot {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
        
        .animate-typing-dot {
          animation: typing-dot 1.4s infinite both;
        }
      `,
        }}
      />
    </div>
  );
};

export default ChatArea;
