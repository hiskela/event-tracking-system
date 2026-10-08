import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-bold text-blue-600 sm:text-2xl"
          >
            EventTrack
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:px-4"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:px-4"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl text-center">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              Discover. Register. Attend.
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Discover Events That Matter to You
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Find events, register easily, receive your digital ticket, and
              keep track of your upcoming activities in one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/register")}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/events")}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Explore Events
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Everything You Need for Events
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                A simple platform for participants, organizers, and
                administrators.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <div className="text-3xl">🔎</div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Discover Events
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Find events based on categories, dates, locations, and other
                  preferences.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <div className="text-3xl">🎟️</div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Digital Tickets
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Register for events and receive a unique digital ticket with
                  a QR code.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <div className="text-3xl">📊</div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Manage Events
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Organizers can create events, manage participants, and track
                  attendance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl bg-blue-600 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to discover your next event?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              Create your account and start exploring events today.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="mt-6 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-gray-100"
            >
              Create Account
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EventTrack. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;