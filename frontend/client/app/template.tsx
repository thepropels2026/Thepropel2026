/**
 * Template component: Wraps around pages to provide consistent entrance animations.
 * Next.js templates create a new instance on every navigation, ensuring animations re-play.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-page-transition">
      {children}
    </div>
  );
}
