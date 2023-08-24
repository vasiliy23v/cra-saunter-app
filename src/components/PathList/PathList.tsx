import React, { useEffect, useState } from "react";
import {
	AppBar,
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Grid,
	IconButton,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import { AddPathForm, PathMap, PathInfo } from ".."; // Make sure to import all required components
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Path, PathCords } from "../../interfaces";
import {
	Favorite,
	FavoriteBorderOutlined,
	NavigateNextOutlined,
} from "@mui/icons-material";
import { useJsApiLoader } from "@react-google-maps/api";
import { PathCard } from "../PathCard";

const DEFAULT_LATITUDE = 50.4546;
const DEFAULT_LONGITUDE = 30.5238;

interface PathListProps {
	onPathSelected: (pathId: string, coords: PathCords[]) => void;
	onOpenAddPathModal: () => void;
}

export function PathList({
	onPathSelected,
	onOpenAddPathModal,
}: PathListProps) {
	const [paths, setPaths] = useState<Path[]>([]); // Change the type from Path[] | [] to Path[]
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedPath, setSelectedPath] = useState<Path | null>(null);
	const [selectedPathCoords, setSelectedPathCoords] = useState<
		PathCords[] | null
	>([{ latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE }]);
	const [selectedPathLength, setSelectedPathLength] = useState<number | null>(
		null
	);

	useEffect(() => {
		const fetchData = async () => {
			const pathsCollection = collection(db, "paths");
			const snapshot = await getDocs(pathsCollection);
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
		fetchData();
	}, []);

	const handleToggleFavorite = async (pathId: string, currentFavorite: any) => {
		try {
			const pathRef = doc(db, "paths", pathId);
			await updateDoc(pathRef, { favorite: !currentFavorite });

			setPaths((prevPaths) =>
				prevPaths.map((path) =>
					path.id === pathId ? { ...path, favorite: !currentFavorite } : path
				)
			);
		} catch (error) {
			console.error("Error toggling favorite:", error);
		}
	};

	const handlePathSelect = (path: Path) => {
		setSelectedPath(path);
		setSelectedPathCoords(path.coords);
		setSelectedPathLength(null);
		onPathSelected(path.id, path.coords);
	};

	const filteredPaths = paths
		.filter(
			(path) =>
				path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				path.description.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => (b.favorite ? 1 : -1));
	const [imageError, setImageError] = useState(false);

	const handleImageError = () => {
		setImageError(true);
	};
	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Box display="flex" alignItems="center" flexGrow={1}>
						<Typography variant="h6">Saunter</Typography>
					</Box>
					<Button
						sx={{ color: "white" }}
						variant="outlined"
						onClick={onOpenAddPathModal}
					>
						Add Path
					</Button>
				</Toolbar>
			</AppBar>

			<TextField
				label="Search Paths"
				variant="outlined"
				fullWidth
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{ margin: "20px 0px" }}
			/>
			<Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
				{filteredPaths.map((path) => (
					<Card key={path.id}>
						<CardContent>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: "20px",
									}}
								>
									<PathCard path={path} />
									<Box>
										<Box sx={{ display: "flex", alignItems: "center" }}>
											{path.favorite ? (
												<IconButton
													aria-label="remove from favorites"
													onClick={() =>
														handleToggleFavorite(path.id, path.favorite)
													}
												>
													<Favorite />
												</IconButton>
											) : (
												<IconButton
													aria-label="add to favorites"
													onClick={() =>
														handleToggleFavorite(path.id, path.favorite)
													}
												>
													<FavoriteBorderOutlined />
												</IconButton>
											)}
											<Typography variant="h5">{path.name}</Typography>
										</Box>
										<Typography
											sx={{
												textOverflow: "ellipsis",
												maxWidth: "500px",
												whiteSpace: "nowrap",
												overflow: "hidden",
											}}
										>
											{path.description}
										</Typography>
									</Box>
								</Box>
								<IconButton onClick={() => handlePathSelect(path)}>
									<NavigateNextOutlined />
								</IconButton>
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>
		</>
	);
}
