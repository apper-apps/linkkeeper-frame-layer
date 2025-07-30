import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const ChatMessage = ({ message, isBot = true, actions = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-3 ${isBot ? "" : "flex-row-reverse space-x-reverse"}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot 
          ? "bg-gradient-to-br from-primary to-secondary" 
          : "bg-gradient-to-br from-slate-400 to-slate-600"
      }`}>
        <ApperIcon 
          name={isBot ? "Bot" : "User"} 
          className="w-4 h-4 text-white" 
        />
      </div>
      
      <div className={`max-w-xs lg:max-w-md ${isBot ? "" : "text-right"}`}>
        <Card className={`p-3 ${
          isBot 
            ? "bg-white" 
            : "bg-gradient-to-br from-slate-100 to-slate-200"
        }`}>
          <p className="text-slate-800 text-sm leading-relaxed">{message}</p>
          
          {actions.length > 0 && (
            <div className="mt-3 space-y-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                    action.variant === "danger" 
                      ? "bg-gradient-to-r from-error to-red-500 text-white hover:shadow-md" 
                      : action.variant === "secondary"
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-md"
                  }`}
                >
                  {action.icon && (
                    <ApperIcon name={action.icon} className="w-4 h-4 inline mr-2" />
                  )}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </Card>
        
        <p className="text-xs text-slate-500 mt-1 px-1">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;