mod catchme;

use catchme::gtfs_to_catchme_data as convert;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn gtfs_to_catchme_data(path: &str) -> String {
    let data = convert(path).unwrap();
    serde_json::to_string_pretty(&data).unwrap()
}
