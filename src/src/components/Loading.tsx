export default function Loading({ fullScreen = false }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-primary shadow-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-extrabold text-3xl tracking-tight">
                HM
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-text-secondary">
            Loading HertsMarketplace…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-sm font-bold animate-pulse">
        HM
      </div>
    </div>
  );
}
