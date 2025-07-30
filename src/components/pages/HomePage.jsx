import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ChatInterface from "@/components/organisms/ChatInterface";
import ReviewPanel from "@/components/organisms/ReviewPanel";
import BookmarksSidebar from "@/components/organisms/BookmarksSidebar";
import { bookmarkService } from "@/services/api/bookmarkService";
import { 
  startGenerating, 
  setSuggestions, 
  startApplying, 
  applyComplete, 
  setBundlingError 
} from "@/store/bundlingSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { suggestions: bundlingSuggestions, isGenerating: isBundling, isApplying } = useSelector(state => state.bundling);
  
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [bookmarksError, setBookmarksError] = useState(null);

  // Load bookmarks on component mount
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setBookmarksLoading(true);
        setBookmarksError(null);
        const result = await bookmarkService.getAll();
        setBookmarks(result || []);
      } catch (error) {
        console.error('Error loading bookmarks:', error.message);
        setBookmarksError('Failed to load bookmarks');
        setBookmarks([]);
      } finally {
        setBookmarksLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const handleRetryBookmarks = () => {
    const loadBookmarks = async () => {
      try {
        setBookmarksLoading(true);
        setBookmarksError(null);
        const result = await bookmarkService.getAll();
        setBookmarks(result || []);
      } catch (error) {
        console.error('Error loading bookmarks:', error.message);
        setBookmarksError('Failed to load bookmarks');
        setBookmarks([]);
      } finally {
        setBookmarksLoading(false);
      }
    };

    loadBookmarks();
  };

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
        duplicates: prev.duplicates.filter(b => b.Id !== bookmarkId),
        deadLinks: prev.deadLinks.filter(b => b.Id !== bookmarkId)
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
      ...scanResult.duplicates.map(b => b.Id),
      ...scanResult.deadLinks.map(b => b.Id)
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
    const ids = bookmarksToRemove.map(b => b.Id);
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

  const handleGenerateBundlingSuggestions = async () => {
    dispatch(startGenerating());
    
    try {
      const suggestions = await bookmarkService.generateBundlingSuggestions();
      dispatch(setSuggestions(suggestions));
      
      if (suggestions.folders && suggestions.folders.length > 0) {
        toast.success(`Found ${suggestions.folders.length} folder suggestions for ${suggestions.suggestedCount} bookmarks!`);
      } else {
        toast.info(suggestions.message || "No bundling suggestions found - your bookmarks are already well organized!");
      }
    } catch (error) {
      dispatch(setBundlingError(error.message));
      toast.error("Failed to generate bundling suggestions");
    }
  };

  const handleApplyBundlingSuggestions = async (suggestions) => {
    dispatch(startApplying());
    
    try {
      const result = await bookmarkService.applyBundlingSuggestions(suggestions);
      dispatch(applyComplete(result));
      
      if (result.success) {
        // Refresh scan result if it exists to show updated folder information
        if (scanResult) {
          const refreshedBookmarks = await bookmarkService.getAll();
          // Update any existing scan results with new folder information
          setScanResult(prev => ({
            ...prev,
            // Refresh the bookmark data while preserving scan categorization
            duplicates: prev.duplicates.map(bookmark => {
              const updated = refreshedBookmarks.find(b => b.Id === bookmark.Id);
              return updated || bookmark;
            }),
            deadLinks: prev.deadLinks.map(bookmark => {
              const updated = refreshedBookmarks.find(b => b.Id === bookmark.Id);
              return updated || bookmark;
            })
          }));
        }
      }
    } catch (error) {
      dispatch(setBundlingError(error.message));
      toast.error("Failed to apply bundling suggestions");
    }
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
              bundlingSuggestions={bundlingSuggestions}
              isBundling={isBundling}
              isApplying={isApplying}
              onGenerateBundling={handleGenerateBundlingSuggestions}
              onApplyBundling={handleApplyBundlingSuggestions}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
<div className="space-y-4">
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
                    className="h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200"
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
              
              {/* Bookmarks Sidebar */}
              <BookmarksSidebar
                bookmarks={bookmarks}
                loading={bookmarksLoading}
                error={bookmarksError}
                onRetry={handleRetryBookmarks}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;