use serde::{Deserialize, Serialize};

// Register a GitHub OAuth App at https://github.com/settings/developers
// with "Device Flow" enabled. The client_id is public (no secret needed).
// Set GITHUB_CLIENT_ID at build time:  GITHUB_CLIENT_ID=Iv1.xxx cargo tauri build
const GITHUB_CLIENT_ID: &str = match option_env!("GITHUB_CLIENT_ID") {
    Some(id) => id,
    None => "REPLACE_WITH_GITHUB_CLIENT_ID",
};

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DeviceFlowStart {
    pub device_code: String,
    pub user_code: String,
    pub verification_uri: String,
    pub expires_in: u64,
    pub interval: u64,
}

#[derive(Serialize)]
pub struct PollResult {
    pub token: Option<String>,
    pub status: String,
}

#[tauri::command]
pub async fn start_device_flow() -> Result<DeviceFlowStart, String> {
    #[derive(Deserialize)]
    struct Raw {
        device_code: String,
        user_code: String,
        verification_uri: String,
        expires_in: u64,
        interval: u64,
    }

    let raw: Raw = reqwest::Client::new()
        .post("https://github.com/login/device/code")
        .header("Accept", "application/json")
        .form(&[("client_id", GITHUB_CLIENT_ID), ("scope", "repo read:user")])
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    Ok(DeviceFlowStart {
        device_code: raw.device_code,
        user_code: raw.user_code,
        verification_uri: raw.verification_uri,
        expires_in: raw.expires_in,
        interval: raw.interval,
    })
}

#[tauri::command]
pub async fn poll_device_flow(device_code: String) -> Result<PollResult, String> {
    #[derive(Deserialize, Default)]
    struct Raw {
        #[serde(default)]
        access_token: Option<String>,
        #[serde(default)]
        error: Option<String>,
    }

    let raw: Raw = reqwest::Client::new()
        .post("https://github.com/login/oauth/access_token")
        .header("Accept", "application/json")
        .form(&[
            ("client_id", GITHUB_CLIENT_ID),
            ("device_code", device_code.as_str()),
            ("grant_type", "urn:ietf:params:oauth:grant-type:device_code"),
        ])
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    if let Some(token) = raw.access_token {
        return Ok(PollResult { token: Some(token), status: "authorized".into() });
    }

    let status = match raw.error.as_deref() {
        Some("authorization_pending") | Some("slow_down") => "pending",
        Some("expired_token") => "expired",
        Some("access_denied") => "access_denied",
        _ => "pending",
    };

    Ok(PollResult { token: None, status: status.into() })
}
