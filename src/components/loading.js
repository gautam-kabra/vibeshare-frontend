export default function Loading() {
  return (
    <div className="skeleton-post">
      <div className="skeleton-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text-group">
          <div className="skeleton-line skeleton-line-short"></div>
          <div className="skeleton-line skeleton-line-shorter"></div>
        </div>
      </div>
      <div className="skeleton-line skeleton-line-full"></div>
      <div className="skeleton-line skeleton-line-medium"></div>
      <div className="skeleton-block"></div>
    </div>
  );
}
