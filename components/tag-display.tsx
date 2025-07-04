interface TagDisplayProps {
  tags: string[]
  priceTags: string[]
  sceneTags: string[]
  accessTags: string[]
  businessTags: string[]
}

export function TagDisplay({ tags, priceTags, sceneTags, accessTags, businessTags }: TagDisplayProps) {
  return (
    <div className="space-y-2">
      {/* 基本タグと料金タグ */}
      <div className="flex flex-wrap gap-1">
        {/* 基本タグ（グレー） */}
        {tags.map((tag) => (
          <span key={tag} className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5 text-xs">
            {tag}
          </span>
        ))}
        
        {/* 料金タグ（ライム色） */}
        {priceTags.map((tag) => (
          <span key={tag} className="bg-green-100 dark:bg-lime-900 text-lime-700 dark:text-lime-300 rounded px-2 py-0.5 text-xs">
            {tag}
          </span>
        ))}
        
        {/* 利用シーンタグ（ピンク） - lg未満では同じ行に表示 */}
        <div className="lg:hidden flex flex-wrap gap-1">
          {sceneTags.map((tag) => (
            <span key={tag} className="bg-pink-100 dark:bg-fuchsia-950 text-fuchsia-700 dark:text-pink-300 rounded px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 利用シーンタグ（ピンク） - lg以上では独立した行 */}
      {sceneTags.length > 0 && (
        <div className="hidden lg:flex flex-wrap gap-1">
          {sceneTags.map((tag) => (
            <span key={tag} className="bg-pink-100 dark:bg-fuchsia-950 text-fuchsia-700 dark:text-pink-300 rounded px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* アクセスタグと営業時間タグ（横並び） */}
      {(accessTags.length > 0 || businessTags.length > 0) && (
        <div className="flex flex-wrap gap-1">
          {/* アクセスタグ（水色・最初に表示） */}
          {accessTags.map((tag) => (
            <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
          
          {/* 営業時間タグ（黄色・その後に表示） */}
          {businessTags.map((tag) => (
            <span key={tag} className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
} 