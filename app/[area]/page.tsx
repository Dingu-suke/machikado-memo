import { Header } from "@/components/header"
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

export default function AreaPage({ params }: AreaPageProps) {
  const decodedArea = decodeURIComponent(params.area)
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
        <h1 className="text-3xl font-bold mb-8">{decodedArea}の街かどメモ</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Link key={shop.slug} href={`/${params.area}/${shop.slug}`} className="block group h-full">
              <div className="rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 h-full flex flex-col">
                <div className="relative w-full h-48 flex-shrink-0">
                  <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors truncate">{shop.name}</h2>
                  <p className="text-muted-foreground mb-2 line-clamp-3 flex-grow">{shop.description}</p>
                  <div className="text-xs text-gray-500 mb-2 truncate">{shop.address}</div>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {shop.tags.map((tag) => (
                      <span key={tag} className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5 text-xs">{tag}</span>
                    ))}
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