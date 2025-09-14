"use client";

import { useState } from "react";
import * as Icons from "react-icons/fi";
import { FiSearch, FiX } from "react-icons/fi";

interface IconPickerProps {
  selectedIcon?: string;
  onIconSelect: (iconName: string) => void;
  onClose: () => void;
}

// Curated list of commonly used icons
const COMMON_ICONS = [
  "FiUser", "FiUsers", "FiCalendar", "FiClock", "FiCheck", "FiCheckCircle",
  "FiAlertCircle", "FiAlertTriangle", "FiInfo", "FiMessageCircle", "FiMail",
  "FiPhone", "FiHome", "FiSettings", "FiTool", "FiCode", "FiDatabase",
  "FiServer", "FiCloud", "FiGithub", "FiGitlab", "FiLayout", "FiEdit",
  "FiEdit2", "FiEdit3", "FiSave", "FiTrash", "FiTrash2", "FiCopy",
  "FiClipboard", "FiBook", "FiBookOpen", "FiFileText", "FiFile", "FiFolder",
  "FiFolderPlus", "FiDownload", "FiUpload", "FiLink", "FiExternalLink",
  "FiZap", "FiFire", "FiStar", "FiHeart", "FiThumbsUp", "FiAward",
  "FiTarget", "FiTrendingUp", "FiBarChart", "FiPieChart", "FiActivity",
  "FiSmartphone", "FiMonitor", "FiTablet", "FiPalette", "FiImage",
  "FiCamera", "FiVideo", "FiMusic", "FiHeadphones", "FiMic", "FiSpeaker",
  "FiShoppingCart", "FiShoppingBag", "FiCreditCard", "FiDollarSign",
  "FiTruck", "FiPackage", "FiMapPin", "FiMap", "FiNavigation", "FiCompass",
  "FiLock", "FiUnlock", "FiKey", "FiShield", "FiEye", "FiEyeOff",
  "FiRefreshCw", "FiRotateCcw", "FiRotateCw", "FiRepeat", "FiShuffle",
  "FiPlay", "FiPause", "FiStop", "FiSkipBack", "FiSkipForward", "FiFastForward"
];

export default function IconPicker({ selectedIcon, onIconSelect, onClose }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = COMMON_ICONS.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background-primary rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-display font-semibold text-lg">
            Select Icon
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple"
          />
        </div>

        {/* Icons Grid */}
        <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
          {filteredIcons.map((iconName) => (
            <button
              key={iconName}
              onClick={() => onIconSelect(iconName)}
              className={`p-2 rounded-lg transition-all duration-200 hover:bg-background-secondary ${
                selectedIcon === iconName
                  ? "bg-spotlight-purple text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title={iconName}
            >
              {renderIcon(iconName)}
            </button>
          ))}
        </div>

        {/* No results */}
        {filteredIcons.length === 0 && (
          <div className="text-center text-text-secondary py-8">
            No icons found matching &quot;{searchTerm}&quot;
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-background-tertiary">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedIcon && onIconSelect(selectedIcon)}
            disabled={!selectedIcon}
            className="px-4 py-2 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}