import type { Participant } from '@/types';
import { VideoTile } from './VideoTile';

interface VideoGridProps {
  participants: Participant[];
  localParticipant: Participant | null;
}

function getGridClass(count: number): string {
  if (count <= 1) return 'grid-cols-1';
  if (count <= 2) return 'grid-cols-2';
  if (count <= 4) return 'grid-cols-2';
  if (count <= 6) return 'grid-cols-3';
  return 'grid-cols-4';
}

export function VideoGrid({ participants, localParticipant }: VideoGridProps) {
  const all = localParticipant
    ? [localParticipant, ...participants.filter((p) => p.userId !== localParticipant.userId)]
    : participants;

  // Spotlight mode: one remote + PiP self
  if (all.length === 2) {
    const local = all.find((p) => p.userId === localParticipant?.userId);
    const remote = all.find((p) => p.userId !== localParticipant?.userId);
    if (local && remote) {
      return (
        <div className="relative w-full h-full p-2">
          {/* Remote full */}
          <VideoTile participant={remote} className="w-full h-full" />
          {/* Local PiP */}
          <div className="absolute bottom-4 right-4 w-40 md:w-52 aspect-video z-10 shadow-2xl rounded-xl overflow-hidden">
            <VideoTile participant={local} isLocal className="h-full w-full" />
          </div>
        </div>
      );
    }
  }

  // Empty state
  if (all.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
        Waiting for participants to join…
      </div>
    );
  }

  const getCols = (count: number) => {
    if (count <= 1) return '1fr';
    if (count <= 4) return 'repeat(2, minmax(0, 1fr))';
    if (count <= 6) return 'repeat(3, minmax(0, 1fr))';
    return 'repeat(4, minmax(0, 1fr))';
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: getCols(all.length),
        gridAutoRows: '1fr',
        gap: 10,
        padding: 10,
      }}
    >
      {all.map((p) => (
        <VideoTile
          key={p.userId}
          participant={p}
          isLocal={p.userId === localParticipant?.userId}
          className="min-h-0"
        />
      ))}
    </div>
  );
}
