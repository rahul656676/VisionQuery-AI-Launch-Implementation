export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Chat with VisionQuery AI</h1>
      </header>

      {/* Main chat area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat history / Context (Sidebar) */}
        <div className="w-64 bg-white border-r p-4 hidden md:block">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Context</h2>
          <div className="p-3 bg-gray-50 rounded text-sm text-gray-600 border border-gray-100">
            No media selected. Upload media first to chat about it.
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {/* Placeholder message */}
              <div className="flex items-start max-w-2xl">
                <div className="flex-shrink-0 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-xs">
                  AI
                </div>
                <div className="ml-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-gray-700">
                  <p>Hello! I am VisionQuery AI. Upload an image or video, and I can answer questions about its content.</p>
                  <p className="text-xs text-gray-400 mt-2">(Chat functionality will be implemented in Phase 4)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 bg-white border-t">
            <div className="max-w-4xl mx-auto flex">
              <input
                type="text"
                placeholder="Ask a question about your media..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
              <button
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                disabled
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
