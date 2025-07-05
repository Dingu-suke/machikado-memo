"use client"

import { useState, useEffect } from 'react';

interface GoogleMapProps {
  address: string
  type?: 'map' | 'streetview' | 'both'
  className?: string
}

// ★ 住所から座標とURLを非同期取得するフック
function useMapUrls(address: string) {
  const [urls, setUrls] = useState<{
    mapUrl: string;
    streetViewUrl: string | null;
    loading: boolean;
    error: string | null;
  }>({
    mapUrl: '',
    streetViewUrl: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const generateUrls = async () => {
      const encodedAddress = encodeURIComponent(address);
      const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      
      try {
        // 座標を取得
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ' Japan')}&limit=1`
        );
        const data = await response.json();
        
        let streetViewUrl = null;
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          const timestamp = Date.now().toString().slice(-10);
          streetViewUrl = `https://www.google.com/maps/embed?pb=!4v${timestamp}!6m8!1m7!1s!2m2!1d${lat}!2d${lng}!3f0!4f0!5f0.7820865974627469`;
        }
        
        setUrls({ mapUrl, streetViewUrl, loading: false, error: null });
      } catch (error) {
        console.error('URL生成エラー:', error);
        setUrls({ mapUrl, streetViewUrl: null, loading: false, error: 'URLの生成に失敗しました' });
      }
    };

    if (address) {
      generateUrls();
    }
  }, [address]);

  return urls;
}

export function GoogleMap({ address, type = 'both', className = '' }: GoogleMapProps) {
  const { mapUrl, streetViewUrl, loading, error } = useMapUrls(address);

  if (loading) {
    return (
      <div className={`my-8 ${className}`}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">地図を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`my-8 ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Google Mapsで開く
          </a>
        </div>
      </div>
    );
  }

  if (type === 'map') {
    return (
      <div className={`my-8 ${className}`}>
        <MapFrame url={mapUrl} title="店舗位置" address={address} />
      </div>
    )
  }

  if (type === 'streetview') {
    return (
      <div className={`my-8 ${className}`}>
        {streetViewUrl ? (
          <StreetViewFrame url={streetViewUrl} address={address} />
        ) : (
          <StreetViewLinkCard address={address} />
        )}
      </div>
    )
  }

  // type === 'both' の場合
  return (
    <div className={`my-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapFrame url={mapUrl} title="店舗位置" address={address} />
        {streetViewUrl ? (
          <StreetViewFrame url={streetViewUrl} address={address} />
        ) : (
          <StreetViewLinkCard address={address} />
        )}
      </div>
    </div>
  )
}

interface MapFrameProps {
  url: string
  title: string
  address: string
}

function MapFrame({ url, title, address }: MapFrameProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{address}</p>
      </div>
      <div className="aspect-video relative">
        <iframe 
          src={url}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${title} - ${address}`}
        />
        <div className="absolute bottom-2 right-2">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors shadow-md"
          >
            📍 Mapsで開く
          </a>
        </div>
      </div>
    </div>
  )
}

// ★ 新しいStreet View埋め込みコンポーネント
function StreetViewFrame({ url, address }: { url: string; address: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          👁️ ストリートビュー
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{address}</p>
      </div>
      <div className="aspect-video relative">
        {!failed ? (
          <iframe 
            src={url}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`ストリートビュー - ${address}`}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🏢</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ストリートビューを読み込めませんでした
              </p>
              <a 
                href={`https://www.google.com/maps/place/${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Google Mapsで開く
              </a>
            </div>
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <a 
            href={`https://www.google.com/maps/place/${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors shadow-md"
          >
            👁️ Street Viewで開く
          </a>
        </div>
      </div>
    </div>
  )
}

// 既存のリンクカード（フォールバック用）
function StreetViewLinkCard({ address }: { address: string }) {
  const encodedAddress = encodeURIComponent(address)
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          👁️ ストリートビュー
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{address}</p>
      </div>
      
      <div className="p-6">
        <div className="aspect-video bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center border-2 border-dashed border-green-200 dark:border-gray-500 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Street Viewで確認
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-xs mx-auto">
              お店の外観や周りの環境を360度確認できます
            </p>
            <a 
              href={`https://www.google.com/maps/place/${encodedAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <span className="text-lg">👁️</span>
              Street Viewで見る
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}