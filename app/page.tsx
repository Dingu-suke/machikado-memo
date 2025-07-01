import { Header } from "@/components/header"
import { getAllAreas } from "@/lib/markdown"
import Link from "next/link"

export default function Page() {
  const areas = getAllAreas()

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">街かどメモ</h1>
          <p className="text-lg text-muted-foreground">
            街ごとのお店やレストランなどの管理しています
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">エリアを選択してください</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <Link key={area} href={`/${area}`} className="block group">
                <div className="rounded-lg border p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{area}</h3>
                  <p className="text-muted-foreground mt-2">
                    {area}エリアの街角メモを見る
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {areas.length === 0 && (
            <div className="text-center text-muted-foreground">まだエリアが登録されていません。</div>
          )}
        </div>
      </div>
    </>
  )
}
