// components/admin/QueriesManagement/QueriesTable.jsx
'use client';

import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  read: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  replied: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  resolved: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const statusLabels = {
  pending: '⏳ Pending',
  read: '👀 Read',
  replied: '💬 Replied',
  resolved: '✅ Resolved',
};

export default function QueriesTable({
  queries,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  searchQuery,
}) {
  const handleDelete = (queryId, queryName) => {
    toast((t) => (
      <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-xl max-w-xs sm:max-w-sm mx-4">
        <p className="font-medium text-sm sm:text-base mb-3">
          Are you sure you want to delete this query from <span className="text-red-400">{queryName}</span>?
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await onDelete(queryId);
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
      },
    });
  };

  if (queries.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 sm:p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery ? 'No matching queries found' : 'No queries available'}
          </h3>
          <p className="text-gray-400 text-sm">
            {searchQuery 
              ? `Try adjusting your search "${searchQuery}"`
              : 'Queries from users will appear here'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-3 sm:p-4 md:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
        Queries
        {searchQuery && (
          <span className="ml-2 text-sm text-gray-400 font-normal">
            ({queries.length} results)
          </span>
        )}
      </h3>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {queries.map((query) => (
          <div
            key={query._id}
            className="bg-black/40 border border-purple-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-white text-sm truncate flex-1">{query.name}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[query.status] || statusColors.pending}`}>
                {statusLabels[query.status] || 'Pending'}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-1 truncate">{query.email}</div>
            <div className="text-xs text-gray-400 mb-2 truncate">{query.subject}</div>
            <div className="flex gap-2">
              <button
                onClick={() => onViewDetails(query)}
                className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(query._id, query.name)}
                className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-gray-300 text-sm md:text-base">
          <thead className="text-gray-400 border-b border-purple-500/20">
            <tr>
              <th className="pb-3 text-xs md:text-sm">#</th>
              <th className="pb-3 text-xs md:text-sm">Name</th>
              <th className="pb-3 text-xs md:text-sm">Email</th>
              <th className="pb-3 text-xs md:text-sm">Subject</th>
              <th className="pb-3 text-xs md:text-sm">Status</th>
              <th className="pb-3 text-xs md:text-sm hidden lg:table-cell">Date</th>
              <th className="pb-3 text-right text-xs md:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {queries.map((query, index) => (
              <tr key={query._id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 text-xs md:text-sm text-gray-500">{index + 1}</td>
                <td className="py-3 text-xs md:text-sm font-medium text-white">{query.name}</td>
                <td className="py-3 text-xs md:text-sm truncate max-w-[120px]">{query.email}</td>
                <td className="py-3 text-xs md:text-sm truncate max-w-[120px]">{query.subject}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[query.status] || statusColors.pending}`}>
                    {statusLabels[query.status] || 'Pending'}
                  </span>
                </td>
                <td className="py-3 text-xs md:text-sm text-gray-400 hidden lg:table-cell">
                  {new Date(query.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right space-x-1 sm:space-x-2">
                  <button
                    onClick={() => onViewDetails(query)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(query._id, query.name)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total count */}
      <div className="mt-4 text-xs text-gray-500 border-t border-purple-500/10 pt-3">
        Total: <span className="text-white font-medium">{queries.length}</span> query{queries.length > 1 ? 'ies' : ''}
      </div>
    </div>
  );
}