import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import BookmarkCard from "@/components/molecules/BookmarkCard";

const ReviewPanel = ({ scanResult, onRemoveBookmark, onClose, onRemoveAllType }) => {
  const [activeTab, setActiveTab] = useState("duplicates");
  const { duplicates = [], deadLinks = [], totalScanned } = scanResult || {};

  const tabs = [
    { id: "duplicates", label: "Duplicates", count: duplicates.length, icon: "Copy" },
    { id: "dead", label: "Dead Links", count: deadLinks.length, icon: "AlertCircle" }
  ];

  const currentData = activeTab === "duplicates" ? duplicates : deadLinks;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-[600px] flex flex-col"
    >
      <Card className="flex-1 bg-gradient-to-br from-white to-slate-50">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Review Issues</h2>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClose}
            />
          </div>
          
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {currentData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {currentData.length} {activeTab === "duplicates" ? "duplicate" : "dead"} bookmark{currentData.length !== 1 ? "s" : ""} found
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  icon="Trash2"
                  onClick={() => onRemoveAllType(activeTab)}
                >
                  Remove All {activeTab === "duplicates" ? "Duplicates" : "Dead Links"}
                </Button>
              </div>
              
              <AnimatePresence>
                {currentData.map(bookmark => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onRemove={onRemoveBookmark}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No {activeTab === "duplicates" ? "Duplicates" : "Dead Links"} Found
              </h3>
              <p className="text-slate-600">
                Your bookmarks look clean in this category!
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ReviewPanel;