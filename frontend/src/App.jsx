import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:3000";

export default function App() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [currentPage, setCurrentPage] = useState("dashboard"); // dashboard | checkout | click | profile
  const [profile, setProfile] = useState(null);

  const isLoggedIn = !!token;

  // --- ambil profil saat sudah punya token ---
  useEffect(() => {
    if (!token) return;
    fetchProfile(token);
  }, [token]);

  const fetchProfile = async (jwt) => {
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengambil profil");
      setProfile(data.user || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      setMessage("Login berhasil 🎉");
      console.log("JWT token:", data.token);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setCurrentPage("dashboard");
    } catch (err) {
      setMessage(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setProfile(null);
    setCurrentPage("dashboard");
    setMessage(null);
  };

  // =======================
  // LOGIN PAGE
  // =======================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2">
          {/* Panel kiri (gradient) */}
          <div className="relative bg-gradient-to-br from-purple-500 via-fuchsia-500 to-amber-400 p-10 flex flex-col justify-between text-white">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-10">
                <span className="text-xl font-bold">TK</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Welcome
                <br />
                Back!
              </h1>
              <p className="mt-4 text-sm text-purple-100 max-w-xs">
                TokoKita – demo backend fokus keamanan: login JWT, password
                hash, dan data pelanggan terenkripsi.
              </p>
            </div>
            <p className="mt-10 text-xs text-purple-100/80">
              © {new Date().getFullYear()} TokoKita. All rights reserved.
            </p>
          </div>

          {/* Panel kanan (form login) */}
          <div className="p-10 md:p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-500">
              Masuk dengan akun demo yang sudah terdaftar di backend.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    placeholder="admin"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    placeholder="********"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {message && (
                <div
                  className={`text-xs rounded-xl border px-3 py-2 bg-slate-50 ${
                    message.toLowerCase().includes("gagal") ||
                    message.toLowerCase().includes("salah")
                      ? "border-red-200 text-red-600"
                      : "border-emerald-200 text-emerald-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-xs text-slate-500 text-center">
              Belum punya akun?{" "}
              <span className="text-purple-600">
                Register dulu via endpoint /auth/register
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =======================
  // DASHBOARD LAYOUT
  // =======================
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-amber-400 flex items-center justify-center text-xs font-bold text-white">
              TK
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                TokoKita Secure Backend Demo
              </h1>
              <p className="text-[11px] text-slate-500">
                JWT auth • Enkripsi data • Click tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="text-right">
                <p className="text-xs font-medium text-slate-800">
                  {profile.username || "User"}
                </p>
                <p className="text-[11px] text-slate-500">Logged in</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium text-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[220px,1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-sm p-4 h-fit">
          <p className="text-xs font-semibold text-slate-500 mb-2">
            NAVIGASI
          </p>
          <nav className="space-y-1 text-sm">
            <NavButton
              active={currentPage === "dashboard"}
              onClick={() => setCurrentPage("dashboard")}
            >
              Dashboard
            </NavButton>
            <NavButton
              active={currentPage === "checkout"}
              onClick={() => setCurrentPage("checkout")}
            >
              Checkout Demo
            </NavButton>
            <NavButton
              active={currentPage === "click"}
              onClick={() => setCurrentPage("click")}
            >
              Click Tracking
            </NavButton>
            <NavButton
              active={currentPage === "profile"}
              onClick={() => setCurrentPage("profile")}
            >
              Profil / Token
            </NavButton>
          </nav>
        </aside>

        {/* Konten utama */}
        <main className="space-y-4">
          {currentPage === "dashboard" && (
            <DashboardHome profile={profile} />
          )}
          {currentPage === "checkout" && <CheckoutPage token={token} />}
          {currentPage === "click" && <ClickPage token={token} />}
          {currentPage === "profile" && (
            <ProfilePage token={token} profile={profile} />
          )}
        </main>
      </div>
    </div>
  );
}

// ===================================
// KOMPONEN-KOMPONEN TAMBAHAN
// ===================================

function NavButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-xl transition ${
        active
          ? "bg-purple-50 text-purple-700 font-semibold"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function DashboardHome({ profile }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Selamat datang{profile?.username ? `, ${profile.username}` : ""} 👋
      </h2>
      <p className="text-sm text-slate-600">
        Ini adalah dashboard demo untuk menunjukkan fitur keamanan:
        autentikasi JWT, enkripsi data checkout, dan pencatatan click event
        ke database PostgreSQL.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <InfoCard
          title="JWT Authentication"
          body="Endpoint /auth/login & /me menggunakan token JWT untuk mengakses data profil user."
        />
        <InfoCard
          title="Encrypted Checkout"
          body="Alamat & nomor telepon pelanggan disimpan dalam bentuk terenkripsi di tabel orders."
        />
        <InfoCard
          title="Click Tracking"
          body="Setiap klik penting di UI bisa dikirim ke endpoint /api/click untuk kebutuhan analitik."
        />
      </div>
    </div>
  );
}

function InfoCard({ title, body }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600">{body}</p>
    </div>
  );
}

function CheckoutPage({ token }) {
  const [items, setItems] = useState("Sepatu x2");
  const [alamat, setAlamat] = useState("Jl. Contoh No. 1");
  const [noTelp, setNoTelp] = useState("08123456789");
  const [total, setTotal] = useState(300000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          alamat,
          no_telepon: noTelp,
          total: Number(total),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout gagal");

      setResult(data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Checkout Demo (terenkripsi)
      </h2>
      <p className="text-xs text-slate-600">
        Form ini akan mengirim data ke <code>/api/checkout</code>. Di database,
        alamat & nomor telepon disimpan dalam bentuk terenkripsi.
      </p>

      <form className="grid md:grid-cols-2 gap-4" onSubmit={handleCheckout}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-700">
              Items
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
              value={items}
              onChange={(e) => setItems(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">
              Alamat
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
              rows={3}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-700">
              No Telepon
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
              value={noTelp}
              onChange={(e) => setNoTelp(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">
              Total (Rp)
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-purple-600 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Kirim Checkout"}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {result && (
        <div className="text-xs bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-emerald-700">
          <p>Checkout berhasil.</p>
          <p>
            <strong>Order ID:</strong> {result.order_id}
          </p>
          <p>
            <strong>Created at:</strong> {result.created_at}
          </p>
        </div>
      )}
    </section>
  );
}

function ClickPage({ token }) {
  const [page, setPage] = useState("/home");
  const [element, setElement] = useState("buy_button");
  const [productId, setProductId] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClickEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page,
          element,
          product_id: Number(productId) || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan click");

      setResult(data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Click Tracking Demo
      </h2>
      <p className="text-xs text-slate-600">
        Endpoint <code>/api/click</code> menyimpan jejak klik user
        (page, element, product_id) ke tabel <code>click_events</code>.
      </p>

      <form
        className="grid md:grid-cols-3 gap-4 items-end"
        onSubmit={handleClickEvent}
      >
        <div>
          <label className="text-xs font-medium text-slate-700">Page</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700">
            Element
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
            value={element}
            onChange={(e) => setElement(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700">
            Product ID (opsional)
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Mengirim..." : "Kirim Click Event"}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {result && (
        <div className="text-xs bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-emerald-700">
          <p>Click event tersimpan.</p>
          <p>
            <strong>ID:</strong> {result.id}
          </p>
        </div>
      )}
    </section>
  );
}

function ProfilePage({ token, profile }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Profil User & Token
      </h2>
      <p className="text-xs text-slate-600">
        Data di bawah ini berasal dari endpoint <code>/me</code> dengan header{" "}
        <code>Authorization: Bearer &lt;token&gt;</code>.
      </p>

      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">Profil</p>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-1">
            <p>
              <span className="font-medium">Username:</span>{" "}
              {profile?.username || "-"}
            </p>
            <p>
              <span className="font-medium">User ID:</span>{" "}
              {profile?.id || "-"}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-slate-800">JWT Token (dipotong)</p>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 font-mono break-all">
            {token
              ? `${token.slice(0, 40)}...`
              : "Token tidak ditemukan di localStorage."}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500">
        Catatan: di aplikasi produksi, token sebaiknya disimpan dengan aman
        (misalnya di HttpOnly cookie) dan tidak ditampilkan di UI.
      </p>
    </section>
  );
}
