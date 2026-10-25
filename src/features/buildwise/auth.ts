import type { Session } from "./types";

const USERS_KEY = "buildwise-users";
export const SESSION_KEY = "buildwise-session";
export const SPLASH_KEY = "buildwise-splash-seen";

type StoredUser = {
  name: string;
  email: string;
  password: string;
};

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.email || !parsed?.name) return null;
    return { name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
}

function writeSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function signUp(input: { name: string; email: string; password: string }): { ok: true; session: Session } | { ok: false; error: string } {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (!name || !email || !password) return { ok: false, error: "Please fill in all fields." };
  if (password.length < 4) return { ok: false, error: "Password must be at least 4 characters." };
  const users = readUsers();
  if (users.some((u) => u.email === email)) return { ok: false, error: "An account with this email already exists." };
  users.push({ name, email, password });
  writeUsers(users);
  const session = { name, email };
  writeSession(session);
  return { ok: true, session };
}

export function signIn(input: { email: string; password: string }): { ok: true; session: Session } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (!email || !password) return { ok: false, error: "Please enter email and password." };
  const user = readUsers().find((u) => u.email === email);
  if (!user || user.password !== password) return { ok: false, error: "Incorrect email or password." };
  const session = { name: user.name, email: user.email };
  writeSession(session);
  return { ok: true, session };
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function updateProfile(input: {
  currentEmail: string;
  name: string;
  email: string;
  password?: string;
}): { ok: true; session: Session } | { ok: false; error: string } {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const currentEmail = input.currentEmail.trim().toLowerCase();
  const password = input.password?.trim() ?? "";

  if (!name || !email) return { ok: false, error: "Please fill in name and email." };
  if (password && password.length < 4) {
    return { ok: false, error: "Password must be at least 4 characters." };
  }

  const users = readUsers();
  const index = users.findIndex((u) => u.email === currentEmail);
  if (index < 0) return { ok: false, error: "Account not found." };

  if (email !== currentEmail && users.some((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const existing = users[index]!;
  users[index] = {
    name,
    email,
    password: password || existing.password,
  };
  writeUsers(users);

  const session = { name, email };
  writeSession(session);
  return { ok: true, session };
}

export function splashSeenThisSession(): boolean {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem(SPLASH_KEY) === "1";
}

export function markSplashSeen() {
  sessionStorage.setItem(SPLASH_KEY, "1");
}
