'use client';

import toast from 'react-hot-toast';

export default function AdminsTable({
  admins,
  onDelete,
  onEdit,
  superAdminEmail,
  editingAdminId,
  isRefreshing,
  onRefresh,
  searchQuery,
}) {
  const handleDelete = (adminId, adminName) => {
    toast((t) => (
      <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-xl max-w-xs sm:max-w-sm mx-4">
        <p className="font-medium text-sm sm:text-base mb-3">
          Are you sure you want to delete admin <span className="text-red-400">{adminName}</span>?
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await onDelete(adminId);
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

  // Show loading state
  if (isRefreshing) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-purple-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400 text-sm">Loading admins...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (admins.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery ? 'No matching admins found' : 'No admins available'}
          </h3>
          <p className="text-gray-400 text-sm">
            {searchQuery 
              ? `Try adjusting your search "${searchQuery}"`
              : 'Add your first admin using the form above'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
          Admins
          {searchQuery && (
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({admins.length} results)
            </span>
          )}
        </h3>
        <button
          onClick={onRefresh}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-2"
          disabled={isRefreshing}
        >
          <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
      
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {admins.map((admin) => {
          const isSuperAdmin = admin.email === superAdminEmail;
          const isEditing = editingAdminId === admin._id;

          return (
            <div
              key={admin._id}
              className={`bg-black/40 border border-purple-500/20 rounded-xl p-4 ${
                isEditing ? 'border-amber-500/50 bg-amber-500/10' : ''
              }`}
            >
              <div className="font-medium text-white text-sm mb-1">{admin.name}</div>
              <div className="text-xs text-gray-400 mb-2 truncate">{admin.email}</div>
              {isSuperAdmin ? (
                <span className="text-xs text-gray-500 px-2 py-1 bg-white/5 rounded-lg border border-white/10 inline-block">
                  👑 Super Admin
                </span>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(admin)}
                    className="flex-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id, admin.name)}
                    className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
              <th className="pb-3 text-right text-xs md:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {admins.map((admin, index) => {
              const isSuperAdmin = admin.email === superAdminEmail;
              const isEditing = editingAdminId === admin._id;

              return (
                <tr
                  key={admin._id}
                  className={`hover:bg-white/5 transition-colors ${
                    isEditing ? 'bg-amber-500/20' : ''
                  }`}
                >
                  <td className="py-3 text-xs md:text-sm text-gray-500">{index + 1}</td>
                  <td className="py-3 text-xs md:text-sm font-medium text-white">{admin.name}</td>
                  <td className="py-3 text-xs md:text-sm">{admin.email}</td>
                  <td className="py-3">
                    {isSuperAdmin ? (
                      <span className="text-xs text-purple-400 px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        👑 Super Admin
                      </span>
                    ) : (
                      <span className="text-xs text-green-400 px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right space-x-1 sm:space-x-2">
                    {isSuperAdmin ? (
                      <span className="text-gray-500 text-xs px-2 sm:px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                        Protected
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(admin)}
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(admin._id, admin.name)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Show total count */}
      {admins.length > 0 && (
        <div className="mt-4 text-xs text-gray-500 border-t border-purple-500/10 pt-3">
          Total: <span className="text-white font-medium">{admins.length}</span> admin{admins.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}