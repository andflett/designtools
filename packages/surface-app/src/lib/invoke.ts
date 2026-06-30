import { invoke } from "@tauri-apps/api/core";
import type { DeviceFlowStart, RecentProject } from "./types.js";

export const commands = {
  // OAuth / keychain
  startDeviceFlow: () =>
    invoke<DeviceFlowStart>("start_device_flow"),
  pollDeviceFlow: (deviceCode: string) =>
    invoke<{ token: string | null; status: string }>("poll_device_flow", { deviceCode }),
  getToken: () => invoke<string | null>("get_token"),
  storeToken: (token: string) => invoke<void>("store_token", { token }),
  clearToken: () => invoke<void>("clear_token"),

  // Recent projects
  getRecentProjects: () => invoke<RecentProject[]>("get_recent_projects"),
  addRecentProject: (project: RecentProject) =>
    invoke<void>("add_recent_project", { project }),
  removeRecentProject: (url: string) =>
    invoke<void>("remove_recent_project", { url }),

  // Surface process lifecycle
  launchProject: (repoUrl: string, stagingUrl?: string) =>
    invoke<void>("launch_project", { repoUrl, stagingUrl: stagingUrl ?? null }),
  stopProject: () => invoke<void>("stop_project"),
};
