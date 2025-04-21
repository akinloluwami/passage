// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::path::PathBuf;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindow};

#[derive(Clone)]
pub enum WindowId {
    Onboarding,
    App,
    Settings,
}

impl std::fmt::Display for WindowId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Onboarding => write!(f, "onboarding"),
            Self::App => write!(f, "app"),
            Self::Settings => write!(f, "settings"),
        }
    }
}

impl WindowId {
    pub fn label(&self) -> String {
        self.to_string()
    }

    pub fn title(&self) -> String {
        match self {
            Self::Onboarding => "Passage Onboarding".to_string(),
            Self::App => "Passage App".to_string(),
            Self::Settings => "Passage Settings".to_string(),
        }
    }

    pub fn get(&self, app: &AppHandle) -> Option<WebviewWindow> {
        let label = self.label();
        app.get_webview_window(&label)
    }

    pub fn min_size(&self) -> Option<(f64, f64)> {
        match self {
            Self::Onboarding => Some((600.0, 600.0)),
            Self::App => Some((1400.0, 900.0)),
            Self::Settings => Some((600.0, 450.0)),
        }
    }
}

pub enum ShowWindow {
    Onboarding,
    App,
    Settings,
}

impl ShowWindow {
    pub fn show(&self, app: &AppHandle) -> tauri::Result<WebviewWindow> {
        if let Some(window) = self.id().get(app) {
            window.set_focus().ok();
            return Ok(window);
        }

        let window = match self {
            Self::Onboarding => {
                let mut builder = WebviewWindow::builder(
                    app,
                    self.id().label(),
                    WebviewUrl::App(PathBuf::from("/")),
                );

                builder = builder
                    .title(self.id().title())
                    .resizable(true)
                    .decorations(true)
                    .maximized(false)
                    .center()
                    .focused(true)
                    .maximizable(true)
                    .shadow(true);

                if let Some(min) = self.id().min_size() {
                    builder = builder
                        .inner_size(min.0, min.1)
                        .min_inner_size(min.0, min.1);
                }

                #[cfg(target_os = "macos")]
                {
                    builder = builder
                        .hidden_title(false)
                        .title_bar_style(tauri::TitleBarStyle::Visible);
                }

                builder.build()?
            }
            Self::App => {
                let mut builder = WebviewWindow::builder(
                    app,
                    self.id().label(),
                    WebviewUrl::App(PathBuf::from("/app")),
                );

                builder = builder
                    .title(self.id().title())
                    .resizable(true)
                    .decorations(true)
                    .maximized(false)
                    .center()
                    .hidden_title(true)
                    .focused(true);

                if let Some(min) = self.id().min_size() {
                    builder = builder
                        .inner_size(min.0, min.1)
                        .min_inner_size(min.0, min.1);
                }

                #[cfg(target_os = "macos")]
                {
                    builder = builder
                        .hidden_title(false)
                        .title_bar_style(tauri::TitleBarStyle::Visible);
                }

                builder.build()?
            }
            Self::Settings => {
                let mut builder = WebviewWindow::builder(
                    app,
                    self.id().label(),
                    WebviewUrl::App(PathBuf::from("/settings")),
                );

                builder = builder
                    .title(self.id().title())
                    .resizable(true)
                    .decorations(true)
                    .maximized(false)
                    .center();

                if let Some(min) = self.id().min_size() {
                    builder = builder
                        .inner_size(min.0, min.1)
                        .min_inner_size(min.0, min.1);
                }

                #[cfg(target_os = "macos")]
                {
                    builder = builder
                        .hidden_title(false)
                        .title_bar_style(tauri::TitleBarStyle::Visible);
                }

                builder.build()?
            }
        };

        // Let's make sure the window is visible and properly focused
        window.show().ok();
        window.set_focus().ok();

        Ok(window)
    }

    pub fn id(&self) -> WindowId {
        match self {
            Self::Onboarding => WindowId::Onboarding,
            Self::App => WindowId::App,
            Self::Settings => WindowId::Settings,
        }
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn open_app_window(app: AppHandle) -> Result<(), String> {
    match ShowWindow::App.show(&app) {
        Ok(_) => {
            println!("App Window Created Successfully!");
            Ok(())
        }
        Err(err) => {
            println!("Failed to Create App Window: {}", err);
            Err("Failed to create App Window".to_string())
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, open_app_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
