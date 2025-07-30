import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/atoms/ProgressBar";

const ScanProgress = ({ progress, currentUrl, totalBookmarks, scannedCount }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="p-4 bg-gradient-to-br from-white to-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Search" className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="font-semibold text-slate-800">Scanning Bookmarks</h3>
          </div>
          <span className="text-sm font-medium text-slate-600">
            {scannedCount} / {totalBookmarks}
          </span>
        </div>
        
        <ProgressBar value={progress} className="mb-3" />
        
        {currentUrl && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
              Currently Checking:
            </p>
            <div className="flex items-center space-x-2 p-2 bg-slate-100 rounded-lg">
              <ApperIcon name="Globe" className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <p className="text-sm text-slate-700 truncate font-mono">
                {currentUrl}
              </p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ScanProgress;