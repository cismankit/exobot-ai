import type {
  CheckoutOut,
  DeviceOut,
  EpisodeRow,
  FactRow,
  HandleResult,
  Identity,
  MeOut,
  PersonaOut,
  ProviderName,
  ProviderOut,
  RoutesOut,
  WaitlistOut,
} from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(`API ${status}: ${detail}`);
  }
}

export interface ClientOptions {
  baseUrl: string;
  /** Returns a bearer token (Clerk session JWT) or null in dev-auth mode. */
  getToken?: () => Promise<string | null>;
}

export class ExobodClient {
  constructor(private opts: ClientOptions) {}

  get baseUrl(): string {
    return this.opts.baseUrl;
  }

  wsUrl(sessionId: string, authed: boolean): string {
    const ws = this.opts.baseUrl.replace(/^http/, "ws");
    return `${ws}/ws/console/${sessionId}${authed ? "?auth=dev" : ""}`;
  }

  private async req<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    const token = await this.opts.getToken?.();
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await fetch(`${this.opts.baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      let detail = res.statusText;
      try {
        const j = (await res.json()) as { detail?: string };
        if (j.detail) detail = String(j.detail);
      } catch {
        /* keep statusText */
      }
      throw new ApiError(res.status, detail);
    }
    return (await res.json()) as T;
  }

  // public
  health() {
    return this.req<{ ok: boolean; dev_auth: boolean }>("GET", "/health");
  }
  joinWaitlist(email: string, referredBy?: string) {
    return this.req<WaitlistOut>("POST", "/waitlist", {
      email,
      referred_by: referredBy ?? null,
    });
  }
  preorderCheckout(email: string) {
    return this.req<CheckoutOut>("POST", "/preorder/checkout", { email });
  }
  preorderStatus(sessionId: string) {
    return this.req<{ order_id: string; status: string; tier: string }>(
      "GET",
      `/preorder/status/${sessionId}`,
    );
  }

  // authed
  me() {
    return this.req<MeOut>("GET", "/me");
  }
  providers() {
    return this.req<ProviderOut[]>("GET", "/me/providers");
  }
  saveProvider(body: {
    provider: ProviderName;
    enabled: boolean;
    api_key?: string;
    model_id?: string | null;
    clear_key?: boolean;
  }) {
    return this.req<ProviderOut[]>("PUT", "/me/providers", body);
  }
  testProvider(provider: ProviderName) {
    return this.req<{ provider: string; available: boolean }>(
      "POST",
      `/me/providers/${provider}/test`,
    );
  }
  routes() {
    return this.req<RoutesOut>("GET", "/me/routes");
  }
  saveRoutes(routes: RoutesOut["routes"]) {
    return this.req<RoutesOut>("PUT", "/me/routes", { routes });
  }

  personas() {
    return this.req<PersonaOut[]>("GET", "/personas");
  }
  createPersona(body: { name: string; identity: Identity; is_default: boolean }) {
    return this.req<PersonaOut>("POST", "/personas", body);
  }
  updatePersona(
    id: string,
    body: { name: string; identity: Identity; is_default: boolean },
  ) {
    return this.req<PersonaOut>("PUT", `/personas/${id}`, body);
  }
  deletePersona(id: string) {
    return this.req<{ deleted: string }>("DELETE", `/personas/${id}`);
  }
  previewPersona(identity: Identity, stimulus: string) {
    return this.req<HandleResult>("POST", "/personas/preview", {
      identity,
      stimulus,
    });
  }

  facts(personaId: string, q?: string) {
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    return this.req<{ facts: FactRow[] }>(
      "GET",
      `/personas/${personaId}/facts${qs}`,
    );
  }
  deleteFact(personaId: string, key: string) {
    return this.req<{ deleted: string }>(
      "DELETE",
      `/personas/${personaId}/facts/${encodeURIComponent(key)}`,
    );
  }
  episodes(personaId: string, q?: string) {
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    return this.req<{ episodes: EpisodeRow[] }>(
      "GET",
      `/personas/${personaId}/episodes${qs}`,
    );
  }

  devices() {
    return this.req<DeviceOut[]>("GET", "/devices");
  }
  pairDevice(name: string) {
    return this.req<DeviceOut>("POST", "/devices/pair", { name });
  }
  deviceEstop(id: string) {
    return this.req<{ device_id: string }>("POST", `/devices/${id}/estop`);
  }
  forgetDevice(id: string) {
    return this.req<{ deleted: string }>("DELETE", `/devices/${id}`);
  }
}
