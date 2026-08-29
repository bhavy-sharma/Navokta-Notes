'use client';

import toast from 'react-hot-toast';

export default function UsersTable({
  users,
  onDelete,
  onEdit,
  editingUserId,
  searchQuery,
  onRefresh,
}) {
  const handleDelete = (userId, userName) => {
    toast((t) => (
      <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-xl max-w-xs sm:max-w-sm mx-4">
        <p className="font-medium text-sm sm:text-base mb-3">
          Are you sure you want to delete user <span className="text-red-400">{userName}</span>?
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await onDelete(userId);
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

  if (users.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 sm:p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery ? 'No matching users found' : 'No users available'}
          </h3>
          <p className="text-gray-400 text-sm">
            {searchQuery 
              ? `Try adjusting your search "${searchQuery}"`
              : 'Add your first user using the form above'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-3 sm:p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Users
          {searchQuery && (
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({users.length} results)
            </span>
          )}
        </h3>
        <button
          onClick={onRefresh}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            className={`bg-black/40 border border-purple-500/20 rounded-xl p-4 ${
              editingUserId === user._id ? 'border-amber-500/50 bg-amber-500/10' : ''
            }`}
          >
            <div className="font-medium text-white text-sm mb-1">{user.name}</div>
            <div className="text-xs text-gray-400 mb-1 truncate">{user.email}</div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                user.role === 'admin'
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {user.role || 'user'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(user)}
                className="flex-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id, user.name)}
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
              <th className="pb-3 text-xs md:text-sm">Role</th>
              <th className="pb-3 text-xs md:text-sm hidden lg:table-cell">Joined</th>
              <th className="pb-3 text-right text-xs md:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`hover:bg-white/5 transition-colors ${
                  editingUserId === user._id ? 'bg-amber-500/20' : ''
                }`}
              >
                <td className="py-3 text-xs md:text-sm text-gray-500">{index + 1}</td>
                <td className="py-3 text-xs md:text-sm font-medium text-white">{user.name}</td>
                <td className="py-3 text-xs md:text-sm truncate max-w-[150px]">{user.email}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="py-3 text-xs md:text-sm text-gray-400 hidden lg:table-cell">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right space-x-1 sm:space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id, user.name)}
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
        Total: <span className="text-white font-medium">{users.length}</span> user{users.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}