interface Props {
  src: string
  title: string
}

export default function IframeViewer({ src, title }: Props) {
  return (
    <div className="w-full border border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-800">
        <span className="text-sm text-gray-400">{title}</span>
      </div>
      <iframe
        src={src}
        title={title}
        className="w-full h-[600px] border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}
