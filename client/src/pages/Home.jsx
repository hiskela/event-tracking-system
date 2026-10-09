
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  bg-white text-gray-900">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gray-950 px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-200 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Discover. Register. Attend.
                </div>

                <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Find Events.
                  <span className="block text-blue-400">
                    Make Experiences.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                  Discover conferences, workshops, sports, cultural events,
                  and more. Register in seconds and keep all your event
                  tickets in one place.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate("/register")}
                    className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
                  >
                    Create Free Account
                  </button>

                  <button
                    onClick={() => navigate("/events")}
                    className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                  >
                    Explore Events
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-400">
                  <span>✓ Easy registration</span>
                  <span>✓ Digital tickets</span>
                  <span>✓ QR check-in</span>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative mx-auto max-w-md">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
                    <div className="rounded-2xl bg-white p-5 text-gray-900">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          FEATURED EVENT
                        </span>

                        <span className="text-sm font-medium text-gray-500">
                          🎟️ Free
                        </span>
                      </div>

                      <div className="mt-6 h-40 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
                        <div className="flex h-full items-center justify-center text-6xl">
                          🎤
                        </div>
                      </div>

                      <h3 className="mt-5 text-xl font-bold">
                        Discover What's Next
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Find exciting events happening around you and connect
                        with people who share your interests.
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-gray-400">Location</p>
                          <p className="mt-1 font-semibold">Your City</p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-gray-400">Tickets</p>
                          <p className="mt-1 font-semibold">Digital</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-5 -left-8 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 shadow-xl backdrop-blur">
                    <p className="text-xs text-gray-400">Your Ticket</p>
                    <p className="mt-1 font-semibold">Ready to scan ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                100%
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Digital Tickets
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Easy
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Registration
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                QR
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Check-in
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                One
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Simple Platform
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Why EventTrack?
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to experience better events
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                From discovering your next event to checking in at the door,
                EventTrack keeps the entire experience simple.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  🔎
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  Discover Events
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Search and explore events by category, location, and other
                  details to find experiences that match your interests.
                </p>

                <button
                  onClick={() => navigate("/events")}
                  className="mt-5 font-semibold text-blue-600 hover:text-blue-700"
                >
                  Explore events →
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  🎟️
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  Get Digital Tickets
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Register for events and receive a unique digital ticket with
                  a QR code that makes event check-in quick and simple.
                </p>

                <button
                  onClick={() => navigate("/events")}
                  className="mt-5 font-semibold text-blue-600 hover:text-blue-700"
                >
                  Find an event →
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                  📊
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  Manage Your Events
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Organizers can create events, manage registrations, monitor
                  attendance, and keep everything organized.
                </p>

                <button
                  onClick={() => navigate("/register")}
                  className="mt-5 font-semibold text-blue-600 hover:text-blue-700"
                >
                  Become an organizer →
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Simple from start to finish
                </span>

                <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Your complete event journey in one place
                </h2>

                <p className="mt-5 leading-7 text-gray-600">
                  EventTrack removes the unnecessary steps between discovering
                  an event and attending it.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      1
                    </div>

                    <div>
                      <h3 className="font-bold">Discover</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Find an event that interests you.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      2
                    </div>

                    <div>
                      <h3 className="font-bold">Register</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Reserve your place with a simple registration.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      3
                    </div>

                    <div>
                      <h3 className="font-bold">Attend</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Show your digital ticket and scan your QR code at
                        check-in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-gray-950 p-6 text-white shadow-xl sm:p-8">
                <div className="rounded-2xl bg-white p-6 text-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Digital Ticket
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        Your Event Pass
                      </h3>
                    </div>

                    <div className="text-3xl">🎟️</div>
                  </div>

                  <div className="mt-8 flex items-center justify-center rounded-xl bg-gray-50 p-8">
                    <div className="grid h-36 w-36 grid-cols-6 gap-1 rounded-lg bg-white p-3 shadow-sm">
                      {Array.from({ length: 36 }).map((_, index) => (
                        <div
                          key={index}
                          className={
                            index % 3 === 0 ||
                            index % 5 === 0 ||
                            index % 7 === 0
                              ? "bg-gray-900"
                              : "bg-white"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t pt-5">
                    <div>
                      <p className="text-xs text-gray-400">
                        Ticket status
                      </p>

                      <p className="mt-1 font-semibold text-green-600">
                        ✓ Confirmed
                      </p>
                    </div>

                    <p className="text-sm font-medium text-gray-500">
                      Scan to check in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-6 py-14 text-center text-white shadow-xl sm:px-10">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              Start today
            </span>

            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold sm:text-4xl">
              Your next great experience could be one click away.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
              Create your free account, explore events, and keep your tickets
              organized in one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/register")}
                className="rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 transition hover:bg-gray-100"
              >
                Create Free Account
              </button>

              <button
                onClick={() => navigate("/events")}
                className="rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Events
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              EventTrack
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Discover. Register. Attend.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-gray-500">
            <button
              onClick={() => navigate("/events")}
              className="hover:text-blue-600"
            >
              Events
            </button>

            <button
              onClick={() => navigate("/login")}
              className="hover:text-blue-600"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="hover:text-blue-600"
            >
              Sign Up
            </button>
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} EventTrack
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
