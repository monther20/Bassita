import Link from "next/link";
import { ReactNode } from "react";

interface SidebarButtonProps {
    label: string;
    href?: string;
    icon?: ReactNode;
    onClick?: () => void;
    variant?: "default" | "active" | "special";
    className?: string;
}

export default function SidebarButton({
    label,
    href,
    icon,
    onClick,
    variant = "default",
    className = ""
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
                {icon && <span className="text-base">{icon}</span>}
                <span className="text-text-primary font-display font-normal">{label}</span>
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClasses}>
            {icon && <span className="text-base">{icon}</span>}
            <span>{label}</span>
        </button>
    );
}