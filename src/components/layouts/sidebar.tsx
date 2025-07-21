import { FiFolder, FiSettings, FiChevronDown, FiArrowUp, FiX } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import SidebarButton from "../sidebarButton";

interface SidebarProps {
    height?: string;
    onClose?: () => void;
}

export default function Sidebar({ height = "h-screen", onClose }: SidebarProps) {
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [isDragging, setIsDragging] = useState(false);
    const sidebarRef = useRef<HTMLElement>(null);
    const isCollapsed = sidebarWidth <= 80;

    // Load width from localStorage on mount
    useEffect(() => {
        const savedWidth = localStorage.getItem('sidebar-width');
        if (savedWidth) {
            setSidebarWidth(parseInt(savedWidth));
        }
    }, []);

    // Save width to localStorage
    useEffect(() => {
        localStorage.setItem('sidebar-width', sidebarWidth.toString());
    }, [sidebarWidth]);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !sidebarRef.current) return;

        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const newWidth = e.clientX - sidebarRect.left;

        // Constrain width between 60px (collapsed) and 400px (max expanded)
        const constrainedWidth = Math.max(60, Math.min(400, newWidth));
        setSidebarWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging]);

    return (
        <aside
            ref={sidebarRef}
            className={`bg-background-primary ${height} flex flex-col relative transition-all duration-200 w-64 lg:w-auto border-r border-background-tertiary`}
            style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${sidebarWidth}px` : '256px' }}
        >
            {/* Mobile close button */}
            {onClose && (
                <div className="lg:hidden flex justify-end p-3 border-b border-background-tertiary">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-background-tertiary transition-colors"
                    >
                        <FiX className="text-text-primary text-xl" />
                    </button>
                </div>
            )}

            <div className={`flex-1 space-y-6 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-4'}`}>
                {/* Boards Section */}
                <div className="space-y-3">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 px-2">
                            <FiFolder className="text-text-primary text-base" />
                            <span className="text-text-primary font-display font-medium">Boards</span>
                        </div>
                    )}
                    <div className={`space-y-1 ${isCollapsed ? '' : 'ml-2'}`}>
                        <SidebarButton
                            label="Marketing Campaign"
                            href="/boards/marketing"
                            icon="🚀"
                            isCollapsed={isCollapsed}
                        />
                        <SidebarButton
                            label="Development Sprint"
                            href="/boards/development"
                            icon="📱"
                            isCollapsed={isCollapsed}
                        />
                        <SidebarButton
                            label="Design System"
                            href="/boards/design"
                            icon="🏷️"
                            isCollapsed={isCollapsed}
                        />
                        {!isCollapsed && (
                            <button className="w-full text-text-secondary text-sm font-display px-3 py-1 hover:text-text-primary transition-colors bg-background-tertiary/50 rounded-lg border-2 border-dashed border-spotlight-purple/50 hover:bg-background-tertiary hover:border-spotlight-purple cursor-pointer">
                                View all boards
                            </button>
                        )}
                    </div>
                </div>

                {/* Templates Section */}
                <div className="space-y-3">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 px-2">
                            <FiFolder className="text-spotlight-yellow text-base" />
                            <span className="text-text-primary font-display font-medium">Templates</span>
                        </div>
                    )}
                    <div className={`space-y-1 ${isCollapsed ? '' : 'ml-2'}`}>
                        <SidebarButton
                            label="Kanban Board"
                            href="/templates/kanban"
                            icon="⚡"
                            isCollapsed={isCollapsed}
                        />
                        <SidebarButton
                            label="Sprint Planning"
                            href="/templates/sprint"
                            icon="🏃"
                            isCollapsed={isCollapsed}
                        />
                        <SidebarButton
                            label="Project Tracker"
                            href="/templates/tracker"
                            icon="📊"
                            isCollapsed={isCollapsed}
                        />
                    </div>
                </div>

                {/* Workspaces Section */}
                <div className="space-y-3">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 px-2">
                            <FiFolder className="text-spotlight-blue text-base" />
                            <span className="text-text-primary font-display font-medium">Workspaces</span>
                        </div>
                    )}
                    <div className={`space-y-2 ${isCollapsed ? '' : 'ml-2'}`}>
                        {isCollapsed ? (
                            <SidebarButton
                                label="Creative Agency"
                                icon={<FiFolder className="text-spotlight-purple" />}
                                variant="special"
                                isCollapsed={isCollapsed}
                            />
                        ) : (
                            <>
                                <div className="bg-spotlight-purple rounded-lg p-3 relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-text-primary font-display font-medium text-sm">
                                                Creative Agency
                                            </div>
                                            <div className="text-text-secondary text-xs font-display">
                                                12 members • 8 boards
                                            </div>
                                        </div>
                                        <FiSettings className="text-text-primary text-base" />
                                    </div>
                                </div>
                                <button className="flex items-center bg-background-tertiary/50 rounded-lg justify-between w-full px-3 py-2 text-text-secondary text-sm font-display hover:text-text-primary hover:bg-background-tertiary transition-colors cursor-pointer">
                                    <span>Switch workspace</span>
                                    <FiChevronDown className="text-base" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Upgrade Plan Button */}
            <div className={isCollapsed ? 'p-2' : 'p-4'}>
                {isCollapsed ? (
                    <SidebarButton
                        label="Upgrade Plan"
                        icon={<FiArrowUp className="text-spotlight-purple" />}
                        isCollapsed={isCollapsed}
                    />
                ) : (
                    <button className="w-full border border-spotlight-purple rounded-lg p-3 flex items-center gap-3 hover:bg-spotlight-purple/50 transition-colors cursor-pointer">
                        <div className="bg-spotlight-purple rounded-full p-1.5">
                            <FiArrowUp className="text-text-primary text-sm" />
                        </div>
                        <span className="text-text-primary font-display font-medium">Upgrade Plan</span>
                    </button>
                )}
            </div>

            {/* Resize Handle - Only on desktop */}
            <div
                className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-spotlight-purple/30 transition-colors"
                onMouseDown={handleMouseDown}
            />
        </aside>
    );
}