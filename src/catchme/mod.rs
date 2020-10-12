use anyhow::{Context, Result};
use gtfs_structures::{Gtfs, Route, RouteType, Shape, Stop, Trip};
use rgb::RGB8;
use serde::Serialize;
use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
};

#[derive(Debug, PartialEq, Serialize)]
pub struct CatchMeShape {
    lat: f64,
    lng: f64,
    sequence: usize,
}

impl CatchMeShape {
    fn from_gtfs_shape(shape: &Shape) -> CatchMeShape {
        CatchMeShape {
            lat: shape.latitude,
            lng: shape.longitude,
            sequence: shape.sequence,
        }
    }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct CatchMeRoute {
    name: String,
    id: String,
    color: Option<String>,
    text_color: Option<String>,
    vehicle: RouteType,
    stops: Vec<String>,
    shape_id: Option<String>,
}

#[derive(Debug, PartialEq, Serialize)]
pub struct CatchMeStop {
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

#[derive(Debug, Serialize)]
pub struct CatchMeData {
    pub routes: HashMap<String, CatchMeRoute>,
    pub stops: HashMap<String, CatchMeStop>,
    pub shapes: HashMap<String, Vec<CatchMeShape>>,
}

type CatchMeTrip = HashMap<(Vec<String>, Option<String>), i32>;

pub fn gtfs_to_catchme_data(path_to_gtfs: &str) -> Result<CatchMeData> {
    let gtfs: Gtfs = Gtfs::new(path_to_gtfs).context("Its not a fucking directory wtf")?;

    let stops_for_routes = get_stops_for_routes(&gtfs.trips);

    let most_popular_trips = get_most_popular_trips(&stops_for_routes, &gtfs.routes);

    let used_stops = get_used_stops(&most_popular_trips, &gtfs.stops);

    let used_shapes = get_used_shapes(&most_popular_trips, &gtfs.shapes);

    let data = CatchMeData {
        routes: most_popular_trips,
        stops: used_stops,
        shapes: used_shapes,
    };

    Ok(data)
}

pub fn get_stops_for_routes(trips: &HashMap<String, Trip>) -> HashMap<String, CatchMeTrip> {
    let mut stops_for_routes: HashMap<String, CatchMeTrip> = HashMap::new();

    for trip in trips.values() {
        let stops_for_route = stops_for_routes.entry(trip.route_id.clone()).or_default();

        let trip_count = stops_for_route.entry(get_trip_data(trip)).or_default();
        *trip_count += 1;
    }

    stops_for_routes
}

pub fn get_most_popular_trips(
    stops_for_routes: &HashMap<String, CatchMeTrip>,
    routes: &HashMap<String, Route>,
) -> HashMap<String, CatchMeRoute> {
    stops_for_routes
        .iter()
        .map(|(key, value)| {
            let route = &routes[key];

            let (stops, shape_id) = most_popular_trip(value);

            let catch_me_route = CatchMeRoute {
                name: route.short_name.clone(),
                id: route.id.clone(),
                color: route.route_color.map(rgb_to_hex),
                text_color: route.route_text_color.map(rgb_to_hex),
                stops,
                vehicle: route.route_type,
                shape_id,
            };

            (key.clone(), catch_me_route)
        })
        .collect()
}

fn most_popular_trip(list: &CatchMeTrip) -> (Vec<String>, Option<String>) {
    list.iter()
        .max_by(|(_, c1), (_, c2)| c1.cmp(c2))
        .unwrap()
        .0
        .clone()
}

fn get_trip_data(trip: &Trip) -> (Vec<String>, Option<String>) {
    let stops = trip
        .stop_times
        .iter()
        .map(|st| st.stop.id.clone())
        .collect();

    (stops, trip.shape_id.clone())
}

pub fn get_used_stops(
    trips: &HashMap<String, CatchMeRoute>,
    stops: &HashMap<String, Arc<Stop>>,
) -> HashMap<String, CatchMeStop> {
    let keys: HashSet<_> = trips.iter().map(|(_, r)| &r.stops).flatten().collect();
    keys.iter()
        .map(|key| ((*key).clone(), stops[*key].clone().into()))
        .collect()
}

pub fn get_used_shapes(
    trips: &HashMap<String, CatchMeRoute>,
    shapes: &HashMap<String, Vec<Shape>>,
) -> HashMap<String, Vec<CatchMeShape>> {
    let keys: HashSet<_> = trips
        .iter()
        .filter_map(|(_, r)| r.shape_id.clone())
        .collect();

    keys.iter()
        .map(|key| {
            (
                (*key).clone(),
                shapes[key]
                    .iter()
                    .map(CatchMeShape::from_gtfs_shape)
                    .collect(),
            )
        })
        .collect()
}

fn rgb_to_hex(input: RGB8) -> String {
    format!("#{:02x}{:02x}{:02x}", input.r, input.g, input.b)
}
