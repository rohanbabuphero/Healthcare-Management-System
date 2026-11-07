import { useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Activity, ArrowUpRight, Bell, CalendarDays, ClipboardList, Clock3, HeartPulse, LayoutDashboard, LogOut, Search, ShieldCheck, Stethoscope, Users, Building2, UserRound, Menu, X } from "lucide-react";
import api from "./services/api";

const roles = ["patient", "doctor", "hospital", "admin"];

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("careflow_user")); } catch { return null; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("careflow_token");
    localStorage.removeItem("careflow_user");
    setUser(null);
    navigate("/login");
  }

  return <Routes>
    <Route path="/login" element={<AuthPage mode="login" onAuth={setUser} />} />
    <Route path="/register" element={<AuthPage mode="register" onAuth={setUser} />} />
    <Route path="/*" element={user ? <Dashboard user={user} logout={logout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /> : <Navigate to="/login" replace />} />
  </Routes>;
}

function AuthPage({ mode, onAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const register = mode === "register";

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      localStorage.setItem("careflow_token", data.token);
      localStorage.setItem("careflow_user", JSON.stringify(data.user));
      onAuth(data.user); navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to server. Check that the backend is running.");
    } finally { setLoading(false); }
  }

  return <main className="min-h-screen grid lg:grid-cols-2 bg-white">
    <section className="hidden lg:flex flex-col justify-between p-12 bg-[#102b4e] text-white">
      <div className="flex items-center gap-3 text-xl font-bold"><span className="rounded-xl bg-teal-400 p-2 text-[#102b4e]"><HeartPulse /></span> CareFlow</div>
      <div className="max-w-lg">
        <p className="text-teal-300 font-semibold tracking-[.2em] text-xs uppercase">Connected care, simplified</p>
        <h1 className="text-5xl font-bold leading-tight mt-4">Better healthcare starts with better connection.</h1>
        <p className="text-blue-100/70 mt-6 leading-7">A unified workspace for patients, doctors, hospitals and administrators.</p>
      </div>
      <p className="text-blue-100/50 text-sm">CareFlow Healthcare Management · Starter edition</p>
    </section>
    <section className="flex items-center justify-center p-6 sm:p-12">
      <form onSubmit={submit} className="w-full max-w-md">
        <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-10"><HeartPulse className="text-teal-600" /> CareFlow</div>
        <p className="text-teal-700 font-semibold text-sm">{register ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}</p>
        <h2 className="text-3xl font-bold mt-2">{register ? "Get started today" : "Sign in to CareFlow"}</h2>
        <p className="text-slate-500 mt-2 mb-8">{register ? "Choose your role and create your workspace." : "Enter your details to access your dashboard."}</p>
        {register && <Field label="Full name"><input required className="field" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>}
        <Field label="Email address"><input required type="email" className="field" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
        <Field label="Password"><input required minLength="6" type="password" className="field" placeholder="At least 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></Field>
        {register && <Field label="Account type"><select className="field" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{roles.map(r=><option key={r} value={r}>{r[0].toUpperCase()+r.slice(1)}</option>)}</select></Field>}
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 mb-4">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-[#12375d] hover:bg-[#0c2948] text-white font-semibold py-3.5 mt-2 disabled:opacity-60">{loading ? "Please wait..." : register ? "Create account" : "Sign in"}</button>
        <p className="text-center text-sm text-slate-500 mt-6">{register ? "Already have an account?" : "New to CareFlow?"} <Link className="text-teal-700 font-semibold" to={register?"/login":"/register"}>{register?"Sign in":"Create account"}</Link></p>
      </form>
    </section>
  </main>;
}

function Field({label,children}) { return <label className="block mb-4"><span className="block text-sm font-medium text-slate-700 mb-2">{label}</span>{children}</label>; }

function Dashboard({ user, logout, mobileOpen, setMobileOpen }) {
  const nav = [
    [LayoutDashboard,"Overview"], [CalendarDays,"Appointments"], [Users,"People"], [ClipboardList,"Medical records"], [Stethoscope,"Doctors"], [Building2,"Hospitals"]
  ];
  const [active,setActive] = useState("Overview");
  const firstName = user.name?.split(" ")[0] || "there";
  return <div className="min-h-screen flex bg-[#f4f7fb]">
    {mobileOpen && <button className="fixed inset-0 bg-slate-950/30 z-20 lg:hidden" onClick={()=>setMobileOpen(false)} aria-label="Close menu"/>}
    <aside className={`${mobileOpen?"translate-x-0":"-translate-x-full"} lg:translate-x-0 fixed lg:static z-30 inset-y-0 left-0 w-64 bg-[#102b4e] text-white flex flex-col transition-transform`}>
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/10"><div className="flex items-center gap-3 font-bold text-xl"><span className="bg-teal-400 text-[#102b4e] p-2 rounded-xl"><HeartPulse size={21}/></span>CareFlow</div><button className="lg:hidden" onClick={()=>setMobileOpen(false)}><X/></button></div>
      <div className="px-5 py-6"><p className="text-[10px] tracking-[.2em] text-blue-200/60 font-bold mb-3">WORKSPACE</p>{nav.map(([Icon,label])=><button key={label} onClick={()=>{setActive(label);setMobileOpen(false)}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm mb-1 ${active===label?"bg-teal-400 text-[#102b4e] font-semibold":"text-blue-100/75 hover:bg-white/10"}`}><Icon size={18}/>{label}</button>)}</div>
      <div className="mt-auto p-5"><div className="rounded-2xl bg-white/10 p-4"><ShieldCheck className="text-teal-300 mb-2"/><p className="text-sm font-semibold">Secure workspace</p><p className="text-xs text-blue-100/60 mt-1">Your role: {user.role}</p></div><button onClick={logout} className="flex items-center gap-3 text-sm text-blue-100/70 hover:text-white mt-5 px-2"><LogOut size={17}/> Sign out</button></div>
    </aside>
    <main className="min-w-0 flex-1">
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3"><button className="lg:hidden" onClick={()=>setMobileOpen(true)}><Menu/></button><div><p className="text-xs text-slate-400">Workspace / {active}</p><h1 className="font-bold text-slate-800">{active}</h1></div></div>
        <div className="flex items-center gap-4"><button className="hidden sm:block text-slate-400"><Search/></button><button className="text-slate-400 relative"><Bell/><i className="absolute top-0 right-0 w-2 h-2 bg-rose-400 rounded-full"/></button><div className="flex items-center gap-3 border-l pl-4 border-slate-100"><div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 grid place-items-center font-bold">{user.name?.[0]?.toUpperCase()}</div><div className="hidden sm:block"><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-slate-400 capitalize">{user.role}</p></div></div></div>
      </header>
      <div className="p-5 sm:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"><div><p className="text-sm text-teal-700 font-semibold">YOUR HEALTHCARE WORKSPACE</p><h2 className="text-2xl sm:text-3xl font-bold mt-2 text-slate-800">Good day, {firstName} 👋</h2><p className="text-slate-500 mt-2">Here’s what’s happening in your healthcare workspace.</p></div><button className="bg-[#12375d] text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#0c2948]">Explore workspace <ArrowUpRight size={17}/></button></div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
          <Stat icon={CalendarDays} title="Appointments" value="—" note="Module coming next" />
          <Stat icon={Users} title="Total patients" value="—" note="Connect patient module" />
          <Stat icon={Activity} title="Active records" value="—" note="Medical records module" />
          <Stat icon={Clock3} title="Pending requests" value="—" note="Workflow module" />
        </div>
        <div className="grid xl:grid-cols-3 gap-5">
          <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6"><div><h3 className="font-bold text-lg">Workspace overview</h3><p className="text-sm text-slate-400 mt-1">Your system is ready for the next modules</p></div><span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 font-semibold">Connected</span></div>
            <div className="rounded-2xl bg-[#f4f8fb] p-6 sm:p-8"><div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 grid place-items-center mb-4"><HeartPulse/></div><h4 className="text-xl font-bold">Welcome to CareFlow</h4><p className="text-slate-500 text-sm leading-6 mt-2 max-w-xl">Your account is active. This starter includes secure registration, login, role selection and a responsive dashboard. We can now build appointments, doctor profiles, patient records and administration screens step by step.</p></div>
          </section>
          <section className="bg-white rounded-2xl border border-slate-100 p-6"><h3 className="font-bold text-lg mb-5">Quick actions</h3><div className="space-y-3">{[[CalendarDays,"Manage appointments"],[UserRound,"View profiles"],[ClipboardList,"Medical records"],[Building2,"Hospital directory"]].map(([Icon,label])=><button key={label} onClick={()=>setActive(label)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 text-left text-sm font-medium"><span className="p-2 rounded-lg bg-white text-teal-700"><Icon size={18}/></span>{label}<ArrowUpRight size={15} className="ml-auto text-slate-400"/></button>)}</div></section>
        </div>
        <p className="text-center text-xs text-slate-400 mt-8">CareFlow · Healthcare Management System · Development starter</p>
      </div>
    </main>
  </div>;
}

function Stat({icon:Icon,title,value,note}) { return <div className="bg-white rounded-2xl p-5 border border-slate-100"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{title}</p><span className="p-2 rounded-xl bg-teal-50 text-teal-700"><Icon size={18}/></span></div><p className="text-3xl font-bold mt-4 text-slate-800">{value}</p><p className="text-xs text-slate-400 mt-1">{note}</p></div>; }

export default App;
