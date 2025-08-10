export type Persona = "candidate" | "recruiter";

const COOKIE_NAME = "talentai_persona";

export function setPersona(role: Persona) {
  document.cookie = `${COOKIE_NAME}=${role}; path=/; max-age=${60 * 60 * 24 * 30}`;
  localStorage.setItem("talentai_user", JSON.stringify({ role, createdAt: Date.now() }));
}

export function getPersona(): Persona | null {
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const fromCookie = (match?.[1] as Persona) || null;
  if (fromCookie) return fromCookie;
  // Fallback to localStorage to avoid any timing issues
  try {
    const ls = localStorage.getItem("talentai_user");
    if (ls) {
      const parsed = JSON.parse(ls);
      const role = parsed?.role as Persona | undefined;
      if (role === "candidate" || role === "recruiter") {
        // Rehydrate cookie for subsequent navigation/refreshes
        setPersona(role);
        return role;
      }
    }
  } catch {}
  return null;
}

export function ensurePersona(): Persona | null {
  return getPersona();
}

export function switchPersona(): Persona {
  const current = getPersona() === "candidate" ? "recruiter" : "candidate";
  setPersona(current);
  return current;
}

export function clearDemoData() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  localStorage.removeItem("talentai_user");
  localStorage.removeItem("talentai_blind");
}
