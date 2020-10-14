mod catchme;

use catchme::gtfs_to_catchme_data;

use gtfs_structures::Gtfs;
use std::panic;

use std::{io::Cursor, vec::Vec};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "fromGtfs")]
pub fn from_gtfs(uint8array: Vec<u8>) -> String {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    let cursor = Cursor::new(&uint8array);

    let gtfs = Gtfs::from_reader(cursor).unwrap_or(Gtfs::default());

    let data = gtfs_to_catchme_data(&gtfs).unwrap();

    serde_json::to_string(&data).unwrap_or("Failed to process gtfs.".to_string())
}
