"use client"

import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          img: ({ src, alt }: any) => {
            if (!src) return null
            return (
              <div className="my-6">
                <Image
                  src={src}
                  alt={alt || ""}
                  width={800}
                  height={600}
                  className="rounded-lg shadow-md"
                  style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
                />
              </div>
            )
          },
          a: ({ href, children, ...props }: any) => {
            // tel:、mailto:、sms:スキームの場合は同じタブで開く（電話、メール、SMSアプリが起動）
            if (href?.startsWith('tel:') || href?.startsWith('mailto:') || href?.startsWith('sms:')) {
              return (
                <a 
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline"
                  {...props}
                >
                  {children}
                </a>
              );
            }
            
            // 外部リンクの場合は新しいタブで開く
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
                {...props}
              >
                {children}
              </a>
            );
          },
          h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
          h2: ({ children }: any) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>,
          h3: ({ children }: any) => <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">{children}</h3>,
          p: ({ children }: any) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
          ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-1 text-foreground">{children}</ul>,
          ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground">{children}</ol>,
          blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}