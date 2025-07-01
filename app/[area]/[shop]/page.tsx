import { Header } from "@/components/header"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { getShopByAreaAndSlug } from "@/lib/markdown"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ShopPageProps {
  params: { area: string; shop: string }
}

export default function ShopPage({ params }: ShopPageProps) {
  const decodedArea = decodeURIComponent(params.area)
  const decodedShop = decodeURIComponent(params.shop)
  const shop = getShopByAreaAndSlug(decodedArea, decodedShop)
  
  if (!shop) {
    return <div className="container mx-auto px-4 py-8">お店が見つかりませんでした。</div>
  }
  const breadcrumb = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${params.area}`}>{decodedArea}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{shop.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )

  return (
    <>
      <Header breadcrumb={breadcrumb} />
      <div className="container mx-auto px-4 py-8">
        <Link href={`/${params.area}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {decodedArea}のお店一覧に戻る
          </Button>
        </Link>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
            <Image src={shop.image} alt={shop.name} fill className="object-cover" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
          <div className="text-muted-foreground mb-2">{shop.address}</div>
          <div className="mb-2">{shop.description}</div>
          <div className="flex flex-wrap gap-1 mb-4">
            {shop.tags.map((tag) => (
              <span key={tag} className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5 text-xs">{tag}</span>
            ))}
          </div>
        </div>
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <MarkdownRenderer content={shop.content} />
        </article>
      </div>
      </div>
    </>
  )
}