import { useState, useEffect } from "react";
import { commands } from "./lib/invoke.js";
import { AuthScreen } from "./screens/AuthScreen.js";
import { HomeScreen } from "./screens/HomeScreen.js";
import { RepoPickerScreen } from "./screens/RepoPickerScreen.js";
import { LaunchScreen } from "./screens/LaunchScreen.js";

type Screen =
  | { id: "loading" }
  | { id: "auth" }
  | { id: "home" }
  | { id: "repopicker" }
  | { id: "launch"; repoUrl: string; stagingUrl?: string };

export function App() {
  const [screen, setScreen] = useState<Screen>({ id: "loading" });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    commands.getToken().then((t) => {
      setToken(t);
      setScreen(t ? { id: "home" } : { id: "auth" });
    });
  }, []);

  const handleAuthComplete = (t: string) => {
    setToken(t);
    setScreen({ id: "home" });
  };

  const handleSignOut = async () => {
    await commands.clearToken();
    setToken(null);
    setScreen({ id: "auth" });
  };

  const handleLaunch = (repoUrl: string, stagingUrl?: string) => {
    setScreen({ id: "launch", repoUrl, stagingUrl });
  };

  const handleBack = async () => {
    await commands.stopProject();
    setScreen({ id: "home" });
  };

  if (screen.id === "loading") {
    return (
      <div className="app-loading">
        <div className="spinner app-spinner" />
      </div>
    );
  }

  if (screen.id === "auth") {
    return <AuthScreen onComplete={handleAuthComplete} />;
  }

  if (screen.id === "home") {
    return (
      <HomeScreen
        token={token!}
        onOpenRepo={() => setScreen({ id: "repopicker" })}
        onLaunch={handleLaunch}
        onSignOut={handleSignOut}
      />
    );
  }

  if (screen.id === "repopicker") {
    return (
      <RepoPickerScreen
        token={token!}
        onSelect={(url) => handleLaunch(url)}
        onBack={() => setScreen({ id: "home" })}
      />
    );
  }

  if (screen.id === "launch") {
    return (
      <LaunchScreen
        repoUrl={screen.repoUrl}
        stagingUrl={screen.stagingUrl}
        onBack={handleBack}
        onStagingFallback={(repoUrl, stagingUrl) => handleLaunch(repoUrl, stagingUrl)}
      />
    );
  }

  return null;
}
