"use client"

import Image from "next/image"
import { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import tomorrow from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

interface MarkdownRendererProps {
  content: string
}

interface CodeComponentProps {
  node?: unknown
  inline?: boolean
  className?: string
  children?: ReactNode
}

interface ImageComponentProps {
  src?: string
  alt?: string
}

interface LinkComponentProps {
  href?: string
  children?: ReactNode
}

interface BasicComponentProps {
  children?: ReactNode
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        urlTransform={(url) => url}
        // tel: リンクを変換しないようにする
        components={{
          code({ node, inline, className, children, ...props }: CodeComponentProps & HTMLAttributes<HTMLElement>) {
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
          img: ({ src, alt }: ImageComponentProps) => {
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
          a: ({ href, children, ...props }: LinkComponentProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
            // tel:、mailto:、sms:スキームの場合は同じタブで開く（電話、メール、SMSアプリが起動）
            if (href?.startsWith('tel:')) {
              return (
                <a 
                  href={href}
                  className="text-green-700 hover:text-green-600 underline font-bold"
                  onClick={(e) => {
                    // 明示的にリンクを開く処理を追加
                    window.location.href = href;
                  }}
                  {...props}
                >
                  📞 {children} (電話)
                </a>
              );
            }

            if (href?.startsWith('mailto:') || href?.startsWith('sms:')) {
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
                🌐 {children}
              </a>
            );
          },
          h1: ({ children }: BasicComponentProps) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
          h2: ({ children }: BasicComponentProps) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>,
          h3: ({ children }: BasicComponentProps) => <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">{children}</h3>,
          p: ({ children }: BasicComponentProps) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
          ul: ({ children }: BasicComponentProps) => <ul className="list-disc list-inside mb-4 space-y-1 text-foreground">{children}</ul>,
          ol: ({ children }: BasicComponentProps) => <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground">{children}</ol>,
          blockquote: ({ children }: BasicComponentProps) => (
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