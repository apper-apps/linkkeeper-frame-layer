import React from 'react';
import { motion } from 'framer-motion';
import BookmarkCard from '@/components/molecules/BookmarkCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';

const BookmarksSidebar = ({ bookmarks, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-center h-64">
          <Loading message="Loading your bookmarks..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Error 
          message={error} 
          onRetry={onRetry}
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Bookmark" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Your Bookmarks</h3>
            <p className="text-sm text-slate-500">
              {bookmarks?.length || 0} bookmark{bookmarks?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {bookmarks && bookmarks.length > 0 ? (
          <div className="p-4 space-y-3">
            {bookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.Id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BookmarkCard 
                  bookmark={bookmark} 
                  showRemove={false}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Bookmark" className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-medium text-slate-600 mb-2">No Bookmarks Yet</h4>
            <p className="text-slate-500 text-sm">
              Start adding bookmarks to see them here
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookmarksSidebar;