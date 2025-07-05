"use client"

import Image from "next/image"
import { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import tomorrow from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { GoogleMap } from './GoogleMaps'

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

// マップコンポーネントを直接JSXとして生成する関数
function processMapDirectives(content: string): { content: string; mapComponents: JSX.Element[] } {
  const mapRegex = /\{\{(googlemap|streetview|maps):([^}]+)\}\}/g
  const mapComponents: JSX.Element[] = []
  let processedContent = content

  let match
  let index = 0
  while ((match = mapRegex.exec(content)) !== null) {
    const type = match[1] as 'googlemap' | 'streetview' | 'maps'
    const address = match[2].trim()
    
    const mapType = type === 'googlemap' ? 'map' : 
                   type === 'streetview' ? 'streetview' : 'both'
    
    // ユニークなキーを生成
    const uniqueKey = `map-${type}-${index}-${Date.now()}`
    
    // JSXコンポーネントを直接作成
    const mapComponent = (
      <GoogleMap 
        key={uniqueKey}
        address={address}
        type={mapType}
      />
    )
    
    mapComponents.push(mapComponent)
    
    // マップディレクティブをマーカーに置換
    processedContent = processedContent.replace(
      match[0], 
      `__REACT_MAP_COMPONENT_${index}__`
    )
    
    index++
  }

  return { content: processedContent, mapComponents }
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // HTMLコメントを除去
  const cleanedContent = content.replace(/<!--[\s\S]*?-->/g, '')
  
  // マップディレクティブを処理
  const { content: processedContent, mapComponents } = processMapDirectives(cleanedContent)

  console.log('=== Direct Replacement Debug ===')
  console.log('Original content snippet:', cleanedContent.substring(0, 500))
  console.log('Processed content snippet:', processedContent.substring(0, 500))
  console.log('Map components count:', mapComponents.length)
  console.log('================================')

  // コンテンツを分割してマップコンポーネントを挿入
  const parts = processedContent.split(/(__REACT_MAP_COMPONENT_\d+__)/g)
  
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {parts.map((part, partIndex) => {
        // マップコンポーネントのマーカーかチェック
        const mapMatch = part.match(/__REACT_MAP_COMPONENT_(\d+)__/)
        if (mapMatch) {
          const mapIndex = parseInt(mapMatch[1])
          return mapComponents[mapIndex] || <div key={`missing-map-${partIndex}`}>Map component not found</div>
        }

        // 通常のMarkdownとして処理
        if (part.trim()) {
          return (
            <ReactMarkdown
              key={`markdown-${partIndex}`}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              urlTransform={(url) => url}
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
                  if (href?.startsWith('tel:')) {
                    return (
                      <a 
                        href={href}
                        className="text-green-600 hover:text-green-700 underline font-bold"
                        onClick={(e) => {
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
                h1: ({ children }: BasicComponentProps) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
                h2: ({ children }: BasicComponentProps) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>,
                h3: ({ children }: BasicComponentProps) => <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">{children}</h3>,
                p: ({ children, ...props }: BasicComponentProps & HTMLAttributes<HTMLParagraphElement>) => {
                  return <p className="mb-4 text-foreground leading-relaxed" {...props}>{children}</p>
                },
                ul: ({ children }: BasicComponentProps) => <ul className="list-disc list-inside mb-4 space-y-1 text-foreground">{children}</ul>,
                ol: ({ children }: BasicComponentProps) => <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground">{children}</ol>,
                blockquote: ({ children }: BasicComponentProps) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {part}
            </ReactMarkdown>
          )
        }
        
        return null
      })}
    </div>
  )
}
