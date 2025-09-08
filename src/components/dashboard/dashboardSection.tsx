import Card from "../card";
import ShowAllBoardsCard from "./ShowAllBoardsCard";

export default function DashboardSection({
    label, info, cards, workspaceId, onCardClick, onWorkspaceClick, showAllBoards = false
}: {
    label?: string;
    info?: {
        members: number;
        boards: number;
        owner: string;
    };
    cards: {
        title: string;
        icon?: string;
        description?: string;
        members: {
            name: string;
            avatar?: string;
        }[];
        lastUpdated?: string;
    }[];
    workspaceId?: string;
    onCardClick?: (cardTitle: string) => void;
    onWorkspaceClick?: () => void;
    showAllBoards?: boolean;
}) {

    const spotlightColors = [
        "border-spotlight-purple",
        "border-spotlight-pink",
        "border-spotlight-blue",
        "border-spotlight-green",
    ];

    const getRandomColor = () => {
        return spotlightColors[Math.floor(Math.random() * spotlightColors.length)];
    }

    console.log("cards", cards);
    console.log("showAllBoards", showAllBoards);

    return (
        <div>
            <div className="flex flex-col gap-2 justify-between">

                <div className="flex flex-col gap-0">
                    {label && (
                        <button 
                            onClick={onWorkspaceClick}
                            className={`text-spotlight-purple neon-text text-lg font-display text-left ${onWorkspaceClick ? 'hover:text-spotlight-purple/80 cursor-pointer' : ''}`}
                        >
                            {label}
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        {info && <span className="text-text-secondary text-sm font-display">{info.members} members</span>}
                        {info && info.members && <span className="text-text-secondary text-sm">•</span>}
                        {info && <span className="text-text-secondary text-sm font-display">{info.boards} boards</span>}
                        {info && info.boards && <span className="text-text-secondary text-sm">•</span>}
                        {info && <span className="text-text-secondary text-sm font-display">{info.owner}</span>}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                {cards.slice(0, showAllBoards ? cards.length : 4).map((card, index) => (
                    <Card
                        key={index}
                        title={card.title}
                        icon={card.icon}
                        description={card?.description}
                        lastUpdated={card?.lastUpdated}
                        members={card.members.map((member) => member.name)}
                        width="w-full"
                        height="h-30"
                        membersSize="w-8 h-8"
                        onClick={() => onCardClick?.(card.title)}
                        className={`bg-background-secondary ${Math.random() > 0.5 ? 'rotate-slight hover:rotate-1' : 'rotate-slight-reverse hover:-rotate-1'} cursor-pointer transition-transform duration-200  border-2 ${getRandomColor()} `}
                    />
                ))}
                {cards.length > 4 && workspaceId && !showAllBoards && (
                    <ShowAllBoardsCard
                        workspaceId={workspaceId}
                        totalBoards={cards.length}
                        className="rotate-slight hover:rotate-1 transition-transform duration-200"
                    />
                )}
            </div>

        </div>
    )
}