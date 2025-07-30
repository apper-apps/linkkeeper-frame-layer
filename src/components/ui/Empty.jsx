import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title = "No bookmarks found", message = "It looks like there's nothing here yet.", actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
        <ApperIcon name="Bookmark" className="w-10 h-10 text-primary/60" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <p className="text-slate-600 max-w-md">{message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;