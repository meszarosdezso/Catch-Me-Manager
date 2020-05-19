use anyhow::{Context, Result};
use gtfs_structures::{Gtfs, Stop, Trip};
use serde::Serialize;
use serde_json;
use std::{
    collections::{HashMap, HashSet},
    fs::File,
    sync::Arc,
};
use structopt::StructOpt;

#[derive(StructOpt, Debug)]
struct Opt {
    /// Path to zip archive or directory
    path: String,
}

#[derive(Debug, PartialEq, Serialize)]
struct CatchMeStop {
    name: String,
    id: String,
    lat: Option<f64>,
    lng: Option<f64>,
}

impl From<Arc<Stop>> for CatchMeStop {
    fn from(stop: Arc<Stop>) -> CatchMeStop {
        CatchMeStop {
            name: stop.name.clone(),
            id: stop.id.clone(),
            lat: stop.latitude,
            lng: stop.longitude,
        }
    }
}
#[derive(Debug, PartialEq, Serialize)]
struct CatchMeData {
    routes: HashMap<String, Vec<String>>,
    stops: HashMap<String, CatchMeStop>,
}

fn main() -> Result<()> {
    let opt = Opt::from_args();

    let gtfs = Gtfs::from_path(opt.path).context("Failed to process given directory.")?;

    let stops_for_routes = get_stops_for_routes(&gtfs.trips);

    let most_popular_trips = get_most_popular_trips(&stops_for_routes);

    let used_stops = get_used_stops(&most_popular_trips, &gtfs.stops);

    let data = CatchMeData {
        routes: most_popular_trips,
        stops: used_stops,
    };

    let file: File = File::create("export.json").context("Failed to create file.")?;

    serde_json::to_writer_pretty(file, &data).context("Failed to export data")?;

    Ok(())
}

fn get_used_stops(
    trips: &HashMap<String, Vec<String>>,
    stops: &HashMap<String, Arc<Stop>>,
) -> HashMap<String, CatchMeStop> {
    let keys: HashSet<_> = trips.values().flatten().collect();
    keys.iter()
        .map(|key| ((*key).clone(), stops[*key].clone().into()))
        .collect()
}

fn get_stops_for_routes(
    trips: &HashMap<String, Trip>,
) -> HashMap<String, HashMap<Vec<String>, i32>> {
    let mut stops_for_routes: HashMap<String, HashMap<Vec<String>, i32>> = HashMap::new();
    for trip in trips.values() {
        let stops_for_route = stops_for_routes.entry(trip.route_id.clone()).or_default();
        let trip_count = stops_for_route.entry(get_stops_for_trip(trip)).or_default();
        *trip_count += 1;
    }
    return stops_for_routes;
}

fn get_most_popular_trips(
    sfr: &HashMap<String, HashMap<Vec<String>, i32>>,
) -> HashMap<String, Vec<String>> {
    sfr.iter()
        .map(|(key, value)| (key.clone(), most_popular_trip(value)))
        .collect()
}

fn most_popular_trip(list: &HashMap<Vec<String>, i32>) -> Vec<String> {
    list.iter()
        .max_by(|(_, c1), (_, c2)| c1.cmp(c2))
        .unwrap()
        .0
        .clone()
}

fn get_stops_for_trip(trip: &Trip) -> Vec<String> {
    trip.stop_times
        .iter()
        .map(|st| st.stop.id.clone())
        .collect()
}
