import { useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
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
}

const ChatArea = ({ messages = [], loading = false }: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-180px)] overflow-y-auto px-4 py-2">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <BsRobot className="text-blue-700 mb-4 w-16 h-16" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            Hi, I'm Perps!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Your AI assistant for the University of Perpetual Help System DALTA
            - Molino Campus. How can I help you today?
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
              <div
                className={`
                  max-w-[80%] md:max-w-[70%] rounded-2xl p-4 
                  ${
                    message.role === 'user'
                      ? 'bg-blue-700 text-white rounded-tr-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none'
                  }
                `}>
                <div className="flex items-center mb-2">
                  {message.role === 'model' ? (
                    <>
                      <BsRobot className="mr-2" />
                      <span className="font-medium">Perps</span>
                    </>
                  ) : (
                    <>
                      <FiUser className="mr-2" />
                      <span className="font-medium">You</span>
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
                          <p className="mb-4 last:mb-0" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-5 mb-4" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal pl-5 mb-4" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-bold" {...props} />
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 className="text-xl font-bold my-3" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg font-bold my-2" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-md font-bold my-2" {...props} />
                        ),
                        code: ({
                          node,
                          inline,
                          ...props
                        }: { node?: any; inline?: boolean } & any) =>
                          inline ? (
                            <code
                              className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded"
                              {...props}
                            />
                          ) : (
                            <code
                              className="block bg-gray-200 dark:bg-gray-700 p-2 rounded my-2 overflow-x-auto"
                              {...props}
                            />
                          ),
                      }}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 rounded-tl-none max-w-[80%] md:max-w-[70%]">
                <div className="flex items-center">
                  <BsRobot className="mr-2" />
                  <span className="font-medium">Perps</span>
                </div>
                <div className="mt-2 flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '0ms' }}></div>
                  <div
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '200ms' }}></div>
                  <div
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatArea;
