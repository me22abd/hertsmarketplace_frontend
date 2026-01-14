export default function Loading({ fullScreen = false }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg z-50">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="spinner w-8 h-8"></div>
    </div>
  );
}
