import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ChatInterface from "@/components/organisms/ChatInterface";
import ReviewPanel from "@/components/organisms/ReviewPanel";
import { bookmarkService } from "@/services/api/bookmarkService";

const HomePage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    setScanProgress({ progress: 0, currentUrl: "", totalBookmarks: 0, scannedCount: 0 });

    try {
      const result = await bookmarkService.scanBookmarks((progress) => {
        setScanProgress(progress);
      });
      
      setScanResult(result);
      toast.success("Bookmark scan completed successfully!");
    } catch (error) {
      toast.error("Failed to scan bookmarks. Please try again.");
      console.error("Scan error:", error);
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  };

  const handleShowReview = () => {
    setShowReview(true);
  };

  const handleCloseReview = () => {
    setShowReview(false);
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await bookmarkService.removeBookmark(bookmarkId);
      
      // Update scan result to remove the bookmark
      setScanResult(prev => ({
        ...prev,
        duplicates: prev.duplicates.filter(b => b.id !== bookmarkId),
        deadLinks: prev.deadLinks.filter(b => b.id !== bookmarkId)
      }));
      
      toast.success("Bookmark removed successfully!");
    } catch (error) {
      toast.error("Failed to remove bookmark. Please try again.");
      console.error("Remove error:", error);
    }
  };

  const handleRemoveAll = async () => {
    if (!scanResult) return;

    const allIssueIds = [
      ...scanResult.duplicates.map(b => b.id),
      ...scanResult.deadLinks.map(b => b.id)
    ];

    if (allIssueIds.length === 0) return;

    try {
      await bookmarkService.removeBulkBookmarks(allIssueIds);
      setScanResult(prev => ({
        ...prev,
        duplicates: [],
        deadLinks: []
      }));
      
      toast.success(`Removed ${allIssueIds.length} problematic bookmarks!`);
      setShowReview(false);
    } catch (error) {
      toast.error("Failed to remove bookmarks. Please try again.");
      console.error("Bulk remove error:", error);
    }
  };

  const handleRemoveAllType = async (type) => {
    if (!scanResult) return;

    const bookmarksToRemove = type === "duplicates" ? scanResult.duplicates : scanResult.deadLinks;
    const ids = bookmarksToRemove.map(b => b.id);

    if (ids.length === 0) return;

    try {
      await bookmarkService.removeBulkBookmarks(ids);
      
      setScanResult(prev => ({
        ...prev,
        [type === "duplicates" ? "duplicates" : "deadLinks"]: []
      }));
      
      toast.success(`Removed ${ids.length} ${type === "duplicates" ? "duplicate" : "dead"} bookmark${ids.length !== 1 ? "s" : ""}!`);
    } catch (error) {
      toast.error(`Failed to remove ${type}. Please try again.`);
      console.error(`Remove ${type} error:`, error);
    }
  };

  const handleSkip = () => {
    // Just acknowledge the skip, no action needed
    toast.info("Scan results saved. You can review them anytime.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Link<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Keeper</span>
          </h1>
          <p className="text-slate-600 text-lg">
            Your intelligent bookmark cleaning assistant
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ChatInterface
              onStartScan={handleStartScan}
              scanResult={scanResult}
              isScanning={isScanning}
              scanProgress={scanProgress}
              onShowReview={handleShowReview}
              onRemoveAll={handleRemoveAll}
              onSkip={handleSkip}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {showReview && scanResult ? (
                <ReviewPanel
                  key="review"
                  scanResult={scanResult}
                  onRemoveBookmark={handleRemoveBookmark}
                  onClose={handleCloseReview}
                  onRemoveAllType={handleRemoveAllType}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[600px] flex items-center justify-center"
                >
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">LK</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      Ready to Clean Your Bookmarks?
                    </h3>
                    <p className="text-slate-600 max-w-md">
                      Start a scan to find duplicate bookmarks and dead links. 
                      The review panel will appear here once the scan is complete.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;