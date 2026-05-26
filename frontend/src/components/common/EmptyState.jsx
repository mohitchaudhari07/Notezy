export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
      <p className="font-semibold text-gray-900">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
