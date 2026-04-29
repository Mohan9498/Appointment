export default function Section({ title, children }) {
  return (
    <div className="glass-card-hover rounded-3xl p-6 space-y-4">
      {title && (
        <h2 className="text-xl font-bold text-gradient">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}