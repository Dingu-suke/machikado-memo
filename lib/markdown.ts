import fs from "fs"
import matter from "gray-matter"
import path from "path"

const shopsDirectory = path.join(process.cwd(), "content/shops")

export interface ShopRecord {
  area: string // 街名
  slug: string // ファイル名ベース
  name: string
  address: string
  image: string
  description: string
  tags: string[]
  price_tags: string[]
  scene_tags: string[]  // 利用シーンタグ（ピンク色）
  access_tags: string[] // アクセスタグ（水色）
  business_tags: string[] // 営業情報タグ（黄色）
  content: string
}

// 街一覧を取得
export function getAllAreas(): string[] {
  return fs.readdirSync(shopsDirectory).filter((name) => {
    const fullPath = path.join(shopsDirectory, name)
    return fs.statSync(fullPath).isDirectory()
  })
}

// 街ごとのお店一覧を取得
export function getShopsByArea(area: string): ShopRecord[] {
  const areaDir = path.join(shopsDirectory, area)
  if (!fs.existsSync(areaDir)) return []
  const fileNames = fs.readdirSync(areaDir)
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "")
      const fullPath = path.join(areaDir, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)
      return {
        area,
        slug,
        content,
        name: data.name,
        address: data.address,
        image: data.image,
        description: data.description,
        tags: data.tags || [],
        price_tags: data.price_tags || [], // 料金タグを追加
        scene_tags: data.scene_tags || [],  // 利用シーンタグを追加
        access_tags: data.access_tags || [], // アクセスタグを追加
        business_tags: data.business_tags || [], // 営業情報タグを追加
      } as ShopRecord
    })
}

// お店詳細を取得
export function getShopByAreaAndSlug(area: string, slug: string): ShopRecord | null {
  const fullPath = path.join(shopsDirectory, area, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  return {
    area,
    slug,
    content,
    name: data.name,
    address: data.address,
    image: data.image,
    description: data.description,
    tags: data.tags || [],
    price_tags: data.price_tags || [], // 料金タグを追加
    scene_tags: data.scene_tags || [],  // 利用シーンタグを追加
    access_tags: data.access_tags || [], // アクセスタグを追加
    business_tags: data.business_tags || [], // 営業情報タグを追加
  } as ShopRecord
}
