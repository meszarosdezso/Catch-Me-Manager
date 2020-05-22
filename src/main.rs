use anyhow::{Context, Result};
use color_convert::color::Color;
use gtfs_structures::{Gtfs, Route, RouteType, Stop, Trip};
use rgb::RGB8;
use serde::Serialize;
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
struct CatchMeRoute {
    name: String,
    id: String,
    color: String,
    vehicle: RouteType,
    stops: Vec<String>,
}

impl From<Route> for CatchMeRoute {
    fn from(route: Route) -> CatchMeRoute {
        CatchMeRoute {
            name: route.short_name,
            id: route.id,
            color: String::new(),
            vehicle: route.route_type,
            stops: Vec::new(),
        }
    }
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
    routes: HashMap<String, CatchMeRoute>,
    stops: HashMap<String, CatchMeStop>,
}

fn main() -> Result<()> {
    let opt = Opt::from_args();

    let gtfs: Gtfs = Gtfs::from_path(opt.path).context("Failed to process given directory.")?;

    let stops_for_routes = get_stops_for_routes(&gtfs.trips);

    let most_popular_trips = get_most_popular_trips(&stops_for_routes, &gtfs.routes);

    let used_stops = get_used_stops(&most_popular_trips, &gtfs.stops);

    let data = CatchMeData {
        routes: most_popular_trips,
        stops: used_stops,
    };

    let file: File = File::create("export.json").context("Failed to create file.")?;

    serde_json::to_writer_pretty(file, &data).context("Failed to export data")?;

    Ok(())
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
    stops_for_routes
}

fn get_most_popular_trips(
    sfr: &HashMap<String, HashMap<Vec<String>, i32>>,
    routes: &HashMap<String, Route>,
) -> HashMap<String, CatchMeRoute> {
    sfr.iter()
        .map(|(key, value)| {
            let route = &routes[&key.clone()];

            let catch_me_route = CatchMeRoute {
                name: route.short_name.clone(),
                id: route.id.clone(),
                color: rgb_to_hex(route.route_color.unwrap()),
                stops: most_popular_trip(value),
                vehicle: route.route_type,
            };

            (key.clone(), catch_me_route)
        })
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

fn get_used_stops(
    trips: &HashMap<String, CatchMeRoute>,
    stops: &HashMap<String, Arc<Stop>>,
) -> HashMap<String, CatchMeStop> {
    let keys: HashSet<_> = trips.iter().map(|(_, r)| &r.stops).flatten().collect();
    keys.iter()
        .map(|key| ((*key).clone(), stops[*key].clone().into()))
        .collect()
}

fn rgb_to_hex(input: RGB8) -> String {
    let input_string = &input.to_string();
    let c = Color::new(input_string);

    c.to_hex().unwrap()
}
