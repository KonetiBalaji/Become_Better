'use client'

interface InsightCardProps {
  content: string
  verifiedSources?: string[]
  generatedAt: Date
  cached?: boolean
}

export default function InsightCard({
  content,
  verifiedSources,
  generatedAt,
  cached,
}: InsightCardProps) {
  return (
    <div className="border rounded-lg p-6 bg-blue-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Insight</h3>
        {cached && (
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
            Cached
          </span>
        )}
      </div>
      <div className="prose max-w-none mb-4">
        <p className="text-gray-700 whitespace-pre-line">{content}</p>
      </div>
      {verifiedSources && verifiedSources.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-semibold mb-2">Verified Sources:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {verifiedSources.map((source, index) => (
              <li key={index}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-4">
        Generated: {new Date(generatedAt).toLocaleDateString()}
      </p>
    </div>
  )
}

