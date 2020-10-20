mod catchme;

use catchme::CatchMeData;
use gtfs_structures::Gtfs;
use std::{io::Cursor, vec::Vec};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "fromGtfs")]
pub fn from_gtfs(uint8array: Vec<u8>) -> String {
    let cursor = Cursor::new(&uint8array);

    let gtfs = Gtfs::from_reader(cursor).unwrap_or(Gtfs::default());

    let data = CatchMeData::from_gtfs(&gtfs);

    serde_json::to_string(&data).unwrap_or("Failed to process gtfs.".to_string())
}
