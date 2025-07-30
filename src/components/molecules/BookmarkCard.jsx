import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const BookmarkCard = ({ bookmark, onRemove, showRemove = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "dead": return "text-error";
      case "duplicate": return "text-warning";
      default: return "text-success";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "dead": return "AlertCircle";
      case "duplicate": return "Copy";
      default: return "CheckCircle";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <img
                src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`}
                alt=""
                className="w-4 h-4 flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <h4 className="font-medium text-slate-800 truncate">
                {bookmark.title || "Untitled Bookmark"}
              </h4>
              <ApperIcon 
                name={getStatusIcon(bookmark.status)} 
                className={`w-4 h-4 flex-shrink-0 ${getStatusColor(bookmark.status)}`} 
              />
            </div>
            
            <p className="text-sm text-slate-600 truncate mb-1 font-mono">
              {bookmark.url}
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <ApperIcon name="Folder" className="w-3 h-3" />
              <span>{bookmark.folder || "Other Bookmarks"}</span>
              <span>•</span>
              <span>{new Date(bookmark.dateAdded).toLocaleDateString()}</span>
            </div>
          </div>
          
          {showRemove && (
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onRemove(bookmark.id)}
              className="ml-2 text-error hover:bg-error/10"
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default BookmarkCard;