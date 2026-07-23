import { PracticeScreen } from "@/components/game/practice-screen";

export default async function ArchiveDayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  return <PracticeScreen day={Number(day)} />;
}
