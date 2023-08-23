import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { PathCords } from "../../interfaces";
import { Box } from "@mui/material";

interface PathMapProps {
	selectedPathCoords: PathCords[];
}

const PathMap: React.FC<PathMapProps> = ({ selectedPathCoords }) => {
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
		const waypoints = selectedPathCoords.slice(1, -1).map((coord) => ({
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

	return (
		<div style={{ width: "100%" }}>
			<GoogleMap zoom={10} center={centerCoords}>
				<div style={{ width: "100%", height: "500px" }}>
					{directions && <DirectionsRenderer directions={directions} />}
				</div>
			</GoogleMap>
		</div>
	);
};

export default PathMap;
