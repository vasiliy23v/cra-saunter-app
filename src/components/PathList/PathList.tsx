// src/components/PathList.js
import { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Grid,
	IconButton,
	List,
	TextField,
	Typography,
} from "@mui/material";
import {
	Favorite,
	FavoriteBorderOutlined,
	NavigateNextOutlined,
} from "@mui/icons-material";

import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Path, PathCords } from "../../interfaces";
import PathMap from "../Map/Map";
import { useJsApiLoader } from "@react-google-maps/api";

export function PathList() {
	const [paths, setPaths] = useState<Path[] | []>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedPath, setSelectedPath] = useState<Path | null>(null);
	const [selectedPathCoords, setSelectedPathCoords] = useState<
		PathCords[] | null
	>(null);
	const GOOGLE_MAPS_API_KEY = "AIzaSyDFBsjZSr3BENXKMXGVSG8QkV1Bn_3TJvQ";

	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
	});
	useEffect(() => {
		const fetchData = async () => {
			const pathsCollection = collection(db, "paths"); // Create a reference to the 'paths' collection
			const snapshot = await getDocs(pathsCollection); // Fetch data from the collection
			const pathData = snapshot.docs.map((doc) => {
				const data = doc.data();
				const geoPoints = data.coords.map((geoPoint: PathCords) => ({
					latitude: geoPoint.latitude,
					longitude: geoPoint.longitude,
				}));
				return {
					id: doc.id,
					coords: geoPoints,
					description: data.description,
					favorite: data.favorite,
					length: data.length,
					name: data.name,
					image: data.image,
				};
			});
			setPaths(pathData);
		};

		fetchData(); // Call the async function
	}, []);

	const filteredPaths = paths.filter(
		(path) =>
			path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			path.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handlePathSelect = (path: Path) => {
		setSelectedPath(path);
		setSelectedPathCoords(path.coords);
	};
	{
		console.log(selectedPathCoords);
	}

	return (
		<Card>
			<CardContent>
				<Typography variant="h4" gutterBottom>
					Paths
				</Typography>
				<TextField
					label="Search Paths"
					variant="outlined"
					fullWidth
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{ marginBottom: 16 }} // Add some spacing below the search input
				/>
				<Grid
					container
					direction="row"
					justifyContent="center"
					alignItems="center"
				>
					<Grid container item xs={6} spacing={3}>
						<List>
							{filteredPaths.map((path) => (
								<Card key={path.id}>
									<CardContent>
										<Box
											sx={{ display: "flex", justifyContent: "space-between" }}
										>
											<Box sx={{ display: "flex", gap: "20px" }}>
												<CardMedia
													component="img"
													sx={{
														width: "100px",
														height: "100px",
														borderRadius: "5px",
													}}
													image={path.image}
													alt="Paella dish"
												/>
												<Box>
													<Box sx={{ display: "flex", alignItems: "center" }}>
														{path.favorite ? (
															<IconButton aria-label="add to favorites">
																<Favorite />
															</IconButton>
														) : (
															<IconButton aria-label="share">
																<FavoriteBorderOutlined />
															</IconButton>
														)}
														<Typography variant="h5">{path.name}</Typography>
													</Box>
													<Typography>{path.description}</Typography>
												</Box>
											</Box>
											<IconButton onClick={() => handlePathSelect(path)}>
												<NavigateNextOutlined />
											</IconButton>
										</Box>
									</CardContent>
								</Card>
							))}
						</List>
					</Grid>
					<Grid container item xs={6} spacing={3}>
						{selectedPath && selectedPathCoords && isLoaded && (
							<>
								{/* <iframe
									width="100%"
									height="400"
									frameBorder="0"
									style={{ border: 0 }}
									src={`https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${
										selectedPathCoords[0].latitude
									},${selectedPathCoords[0].longitude}&destination=${
										selectedPathCoords[selectedPathCoords.length - 1].latitude
									},${
										selectedPathCoords[selectedPathCoords.length - 1].longitude
									}&waypoints=${selectedPathCoords}`}
									allowFullScreen
									title="Path Route"
								/> */}
								<PathMap selectedPathCoords={selectedPathCoords} />
							</>
						)}
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}
