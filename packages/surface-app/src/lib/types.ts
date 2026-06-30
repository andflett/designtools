export interface RecentProject {
  name: string;
  owner: string;
  url: string;
  projectRoot: string;
  lastOpened: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  pushed_at: string;
  language: string | null;
}

export interface DeviceFlowStart {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  expiresIn: number;
  interval: number;
}

export interface LaunchProgress {
  phase: "clone" | "install" | "start" | "wait" | "ready" | "error";
  message: string;
}
