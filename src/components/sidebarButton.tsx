import Link from "next/link";
import { ReactNode } from "react";
import * as Icons from "react-icons/fi";

interface SidebarButtonProps {
    label: string;
    href?: string;
    icon?: ReactNode;
    onClick?: () => void;
    variant?: "default" | "active" | "special";
    className?: string;
    isCollapsed?: boolean;
}

export default function SidebarButton({
    label,
    href,
    icon,
    onClick,
    variant = "default",
    className = "",
    isCollapsed = false
}: SidebarButtonProps) {
    const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-display transition-colors w-full h-8";

    const variantClasses = {
        default: "text-text-primary bg-background-tertiary hover:bg-spotlight-purple/50",
        active: "text-text-primary bg-background-tertiary",
        special: "text-text-primary bg-spotlight-purple hover:bg-spotlight-purple/80"
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {`<${Icons}.${icon} />`}
                <span className="text-text-primary font-display font-normal">{label}</span>
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClasses}>
            {`<${Icons}.${icon} />`}
            {!isCollapsed && <span>{label}</span>}
        </button>
    );
}