'use client'

import Image from 'next/image'

type FeedCardProps = {
  itemName: string
  category: string
  place: string
  datetime: string
  photoUrl?: string
  type: 'Lost' | 'Found'
}

export default function FeedCard({
  itemName,
  category,
  place,
  datetime,
  photoUrl,
  type,
}: FeedCardProps) {
  return (
    <div className="bg-gray-100 rounded-2xl p-4 w-full max-w-md backdrop-blur-md border-l-4 shadow border-indigo-800 space-y-3 transition-transform hover:scale-[1.01]">
      {/* Header: Item Name and Tag */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">{itemName}</h2>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            type === 'Lost'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {type}
        </span>
      </div>

      {/* Image Section */}
      {photoUrl && (
        <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-300">
          <Image
            src={photoUrl}
            alt={itemName}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 400px"
          />
        </div>
      )}

      {/* Details */}
      <div className="text-sm text-gray-800 space-y-1">
        <p>
          <span className="font-medium text-black">Category:</span> {category}
        </p>
        <p>
          <span className="font-medium text-black">Place:</span> {place}
        </p>
        <p>
          <span className="font-medium text-black">Date:</span>{' '}
          {new Date(datetime).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  )
}
