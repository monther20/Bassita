import Card from "../card";
import ShowAllBoardsCard from "./ShowAllBoardsCard";

export default function DashboardSection({
    label, info, cards, workspaceId
}: {
    label?: string;
    info?: {
        members: number;
        boards: number;
        owner: string;
    };
    cards: {
        title: string;
        description?: string;
        members: {
            name: string;
            avatar?: string;
        }[];
        lastUpdated?: string;
    }[];
    workspaceId?: string;
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

    console.log(getRandomColor());
    return (
        <div>
            <div className="flex flex-col gap-2 justify-between">

                <div className="flex flex-col gap-0">
                    {label && <span className="text-spotlight-purple neon-text text-lg font-display">{label}</span>}
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
                {cards.slice(0, 4).map((card) => (
                    <Card
                        title={card.title}
                        description={card?.description}
                        lastUpdated={card?.lastUpdated}
                        members={card.members.map((member) => member.name)}
                        width="w-full"
                        height="h-30"
                        className={`bg-background-secondary ${Math.random() > 0.5 ? 'rotate-slight hover:rotate-1' : 'rotate-slight-reverse hover:-rotate-1'} cursor-pointer transition-transform duration-200  border-2 ${getRandomColor()} hover:bg-background-secondary/50`}
                    />
                ))}
                {cards.length > 4 && workspaceId && (
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