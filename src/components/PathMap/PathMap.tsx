import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { PathCords } from "../../interfaces";
import { Box } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface PathMapProps {
	selectedPathId: string;
	selectedPathCoords: PathCords[];
	isLoaded: boolean;
}

export const PathMap: React.FC<PathMapProps> = ({
	selectedPathId,
	selectedPathCoords,
	isLoaded,
}) => {
	const [markerCoords, setMarkerCoords] = useState<google.maps.LatLngLiteral[]>(
		[]
	);

	const [selectedCoordsIndex, setSelectedCoordsIndex] = useState<number | null>(
		null
	);

	const handleAddMarker = () => {
		setMarkerCoords((prevCoords) => [...prevCoords, { lat: 0, lng: 0 }]);
		setSelectedCoordsIndex(markerCoords.length);
	};

	const handleMapClick = (event: google.maps.MapMouseEvent) => {
		const newCoords = {
			lat: event.latLng !== null ? event.latLng.lat() : 0,
			lng: event.latLng !== null ? event.latLng.lng() : 0,
		};
		setMarkerCoords((prevCoords) => [...prevCoords, newCoords]);
		handleAddMarkerToDB(newCoords); // Добавление координат в базу данных
	};

	const handleMarkerClick = (index: number) => {
		setSelectedCoordsIndex(index);
	};

	const centerCoords: google.maps.LatLng | google.maps.LatLngLiteral = {
		lat: selectedPathCoords[0].latitude,
		lng: selectedPathCoords[0].longitude,
	};

	const [directions, setDirections] =
		useState<google.maps.DirectionsResult | null>(null);

	useEffect(() => {
		const origin = new window.google.maps.LatLng(
			selectedPathCoords[0].latitude,
			selectedPathCoords[0].longitude
		);
		const destination = new window.google.maps.LatLng(
			selectedPathCoords[selectedPathCoords.length - 1].latitude,
			selectedPathCoords[selectedPathCoords.length - 1].longitude
		);
		console.log(selectedPathCoords);

		const waypoints = selectedPathCoords.map((coord) => ({
			location: new window.google.maps.LatLng(coord.latitude, coord.longitude),
		}));

		const directionsService = new window.google.maps.DirectionsService();

		directionsService.route(
			{
				origin: origin,
				destination: destination,
				waypoints: waypoints,
				travelMode: window.google.maps.TravelMode.WALKING,
			},
			(result, status) => {
				if (status === window.google.maps.DirectionsStatus.OK) {
					setDirections(result);
				}
			}
		);
	}, [selectedPathCoords]);

	const handleAddMarkerToDB = async (coords: google.maps.LatLngLiteral) => {
		try {
			const pathId = selectedPathId;
			const pathRef = doc(db, "paths", pathId);
			await updateDoc(pathRef, {
				coords: [...selectedPathCoords, coords],
			});

			console.log("Marker added to database:", coords);
		} catch (error) {
			console.error("Error adding marker to database:", error);
		}
	};

	return (
		<div style={{ width: "100%" }}>
			{selectedPathCoords && isLoaded ? (
				<GoogleMap zoom={10} center={centerCoords} onClick={handleMapClick}>
					<div style={{ width: "100%", height: "500px" }}>
						{directions && (
							<DirectionsRenderer
								directions={directions}
								options={{
									polylineOptions: {
										strokeColor: "orange",
										strokeWeight: 4,
									},
								}}
							/>
						)}
						{markerCoords.map((coords, index) => (
							<Marker
								key={index}
								position={{ lat: coords.lat, lng: coords.lng }}
								onClick={() => handleMarkerClick(index)}
							/>
						))}
						{/* {selectedPathCoords.map((coord, index) => (
							<Marker
								key={index}
								position={{ lat: coord.latitude, lng: coord.longitude }}
							/>
						))} */}
					</div>
				</GoogleMap>
			) : (
				<>Loading</>
			)}
		</div>
	);
};
