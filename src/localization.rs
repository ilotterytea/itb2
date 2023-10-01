use include_dir::{include_dir, Dir};
use std::{collections::HashMap, str::from_utf8};

#[derive(PartialEq, Eq, Hash)]
pub enum LineId {
    CommandPingResponse,
}

impl LineId {
    pub fn from_string(value: String) -> Option<Self> {
        match value.as_str() {
            "cmd.ping.response" => Some(Self::CommandPingResponse),
            _ => None,
        }
    }
}

pub struct Localizator {
    localizations: HashMap<String, HashMap<LineId, String>>,
}

const LOCALIZATION_DIR: Dir = include_dir!("localizations");

impl Localizator {
    pub fn new() -> Self {
        let mut localizations: HashMap<String, HashMap<LineId, String>> = HashMap::new();

        for file in LOCALIZATION_DIR.files() {
            let file_name = file.path();
            let language = file_name.file_stem().and_then(|s| s.to_str()).unwrap();

            let contents = from_utf8(file.contents()).expect("Failed to read file");
            let data: HashMap<String, String> = serde_json::from_str(contents).unwrap();

            let map = localizations.entry(language.to_string()).or_default();

            for (line_id, line) in data {
                if let Some(line_id) = LineId::from_string(line_id) {
                    map.insert(line_id, line);
                }
            }
        }

        Self { localizations }
    }

    pub fn get_literal_text(&self, locale_id: &str, line_id: LineId) -> Option<String> {
        if let Some(locale) = self.localizations.get(locale_id) {
            if let Some(line) = locale.get(&line_id) {
                return Some(line.clone());
            }
        }

        None
    }
}
