import { Header } from "@/components/header"
import { TagDisplay } from "@/components/tag-display"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getShopsByArea } from "@/lib/markdown"
import Image from "next/image"
import Link from "next/link"

interface AreaPageProps {
  params: { area: string }
}

export default async function AreaPage({ params }: AreaPageProps) {
  const resolvedParams = await params
  const decodedArea = decodeURIComponent(resolvedParams.area)
  const shops = getShopsByArea(decodedArea) 

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
          <BreadcrumbPage>{decodedArea}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )

  return (
    <>
      <Header breadcrumb={breadcrumb} />
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-8">{decodedArea}の街かど</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Link key={shop.slug} href={`/${resolvedParams.area}/${shop.slug}`} className="block group h-full">
              <div className="rounded-lg overflow-hidden shadow-xl transition-all transform hover:-translate-y-2 hover:shadow-2xl border border-border-100 dark:border-gray-700 bg-white dark:bg-gray-900 h-full flex flex-col">
                <div className="relative w-full h-48 flex-shrink-0">
                  <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors truncate">{shop.name}</h2>
                  <p className="text-muted-foreground mb-2 line-clamp-3 h-12">{shop.description}</p>
                  <div className="text-xs text-gray-500 mb-3 truncate h-4">{shop.address}</div>
                  
                  {/* 住所とタグの間の区切り線 - 固定位置に配置 */}
                  <div className="border-t border-gray-200 dark:border-gray-700 mb-3"></div>
                  
                  <div>
                    <TagDisplay 
                      tags={shop.tags}
                      priceTags={shop.price_tags}
                      sceneTags={shop.scene_tags}
                      accessTags={shop.access_tags}
                      businessTags={shop.business_tags}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {shops.length === 0 && (
          <div className="text-center text-muted-foreground mt-12">この街のメモはまだありません。</div>
        )}
      </div>
    </>
  )
} 