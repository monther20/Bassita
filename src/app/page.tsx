export default function Home() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-display text-text-primary mb-4">
            Bassita
          </h1>
          <h2 className="text-2xl font-body text-text-secondary mb-8">
            Task Management Made{" "}
            <span className="text-spotlight-purple">Simple</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-md">
            Collaborative task management platform that makes teamwork simple
            and fun
          </p>
          <div className="mt-8">
            <button className="bg-gradient-to-r from-spotlight-purple to-spotlight-pink text-white px-8 py-3 rounded-full font-semibold hover:shadow-glow-purple transition-all duration-300 hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
