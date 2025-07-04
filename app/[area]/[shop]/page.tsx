import { Header } from "@/components/header"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { TagDisplay } from "@/components/tag-display"
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
import { IoMdPin } from "react-icons/io"

interface ShopPageProps {
  params: { area: string; shop: string }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const resolvedParams = await params
  const decodedArea = decodeURIComponent(resolvedParams.area)
  const decodedShop = decodeURIComponent(resolvedParams.shop || '')
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
            <Link href={`/${resolvedParams.area}`}>{decodedArea}</Link>
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
        <Link href={`/${resolvedParams.area}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {decodedArea}の街かどへ戻る
          </Button>
        </Link>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
            <Image src={shop.image} alt={shop.name} fill className="object-cover" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
          <div className="text-muted-foreground mb-2 flex items-center">
            <IoMdPin className="mr-0.5 mb-0.5 flex-shrink-0 text-lg" />
            <div className="flex-grow">{shop.address}</div>
          </div>
          <div className="mb-4">{shop.description}</div>
          <div className="mb-4">
            <TagDisplay 
              tags={shop.tags}
              priceTags={shop.price_tags}
              sceneTags={shop.scene_tags}
              accessTags={shop.access_tags}
              businessTags={shop.business_tags}
            />
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