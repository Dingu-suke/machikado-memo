interface MapMatch {
  type: 'googlemap' | 'streetview' | 'maps'
  address: string
  fullMatch: string
  index: number
}

export function extractMapDirectives(content: string): {
  content: string
  maps: MapMatch[]
} {
  // {{maps:住所}}、{{googlemap:住所}}、{{streetview:住所}} のパターンを検出
  const mapRegex = /\{\{(googlemap|streetview|maps):([^}]+)\}\}/g
  const maps: MapMatch[] = []
  
  let match
  let index = 0
  while ((match = mapRegex.exec(content)) !== null) {
    maps.push({
      type: match[1] as 'googlemap' | 'streetview' | 'maps',
      address: match[2].trim(),
      fullMatch: match[0],
      index: index++
    })
  }

  // マップディレクティブを一時的なプレースホルダーに置換
  let processedContent = content
  maps.forEach((map) => {
    processedContent = processedContent.replace(
      map.fullMatch, 
      `__MAP_PLACEHOLDER_${map.index}__`
    )
  })

  return { content: processedContent, maps }
}

// ★ 同期版：基本的なURL生成（ReactコンポーネントでuseEffectを使って非同期処理する）
export function generateMapUrls(address: string) {
  const encodedAddress = encodeURIComponent(address)
  
  // 通常の地図埋め込みURL（APIキー不要で確実に動作）
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`
  
  // Street View URLはReactコンポーネント側で非同期生成する
  return { mapUrl, streetViewUrl: null }
}