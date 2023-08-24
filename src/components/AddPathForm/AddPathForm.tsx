import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Path } from "../../interfaces";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface AddPathFormProps {
	onAddPath: (newId: string) => void;
	onClose: () => void;
	isOpen: boolean; // Add this line to include the isOpen prop
}

export const AddPathForm: React.FC<AddPathFormProps> = ({
	onAddPath,
	onClose,
	isOpen,
}) => {
	const [newPath, setNewPath] = useState<Path>({
		id: "", // Генерировать id можно в функции добавления в Firebase
		coords: [], // Маркеры добавляются на карту, их можно получить после сохранения в Firebase
		description: "",
		favorite: false,
		length: 0,
		name: "",
		image: "",
	});
	const [isMapUsed, setisMapUsed] = useState(newPath.coords.length === 0);

	useEffect(() => {
		console.log("newPath", newPath);
		setisMapUsed(!isMapUsed);
	}, [setNewPath, isMapUsed]);

	const handleAddMarker = (event: google.maps.MapMouseEvent) => {
		const newCoords = {
			latitude:
				event.latLng !== null ? parseFloat(event.latLng.lat().toFixed(6)) : 0,
			longitude:
				event.latLng !== null ? parseFloat(event.latLng.lng().toFixed(6)) : 0,
		};
		setNewPath((prevPath) => ({
			...prevPath,
			coords: [...prevPath.coords, newCoords],
		}));
	};

	const handleAddPath = async () => {
		try {
			// Добавляем путь в Firebase
			const newId = generateUniqueId();
			const pathsCollection = collection(db, "paths");
			await addDoc(pathsCollection, newPath);

			// Сбрасываем состояние формы и вызываем функцию обновления списка путей
			setNewPath({
				id: newId,
				coords: [],
				description: "",
				favorite: false,
				length: 0,
				name: "",
				image: "",
			});
			onAddPath(newId);
			onClose(); // Закрыть модальное окно после добавления пути
		} catch (error) {
			console.error("Error adding path:", error);
		}
	};

	const generateUniqueId = () => {
		return Date.now().toString() + Math.random().toString(36).substr(2, 9);
	};

	const mapContainerStyle = {
		width: "100%",
		height: "400px",
	};

	const center = {
		lat: 50.45466,
		lng: 30.5238,
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "20px",
			}}
		>
			<Typography variant="h5">Add New Path</Typography>
			<Box>
				<TextField
					label="Name"
					variant="outlined"
					fullWidth
					value={newPath.name}
					onChange={(e) => setNewPath({ ...newPath, name: e.target.value })}
				/>
			</Box>
			<Box>
				<TextField
					label="Description"
					variant="outlined"
					fullWidth
					multiline
					rows={4}
					value={newPath.description}
					onChange={(e) =>
						setNewPath({ ...newPath, description: e.target.value })
					}
				/>
			</Box>
			<Box>
				<TextField
					label="Image URL"
					variant="outlined"
					fullWidth
					value={newPath.image}
					onChange={(e) => setNewPath({ ...newPath, image: e.target.value })}
				/>
			</Box>
			<Box>
				<div style={mapContainerStyle}>
					<GoogleMap
						mapContainerStyle={mapContainerStyle}
						center={{
							lat:
								newPath.coords.length > 0
									? newPath.coords[newPath.coords.length - 1].latitude
									: center.lat,
							lng:
								newPath.coords.length > 0
									? newPath.coords[newPath.coords.length - 1].longitude
									: center.lng,
						}}
						zoom={10}
						onClick={handleAddMarker}
					>
						{newPath.coords.map((coord, index) => (
							<Marker
								key={index}
								position={{
									lat: coord.latitude,
									lng: coord.longitude,
								}}
							/>
						))}
					</GoogleMap>
				</div>
			</Box>
			<Box>
				<Button
					variant="contained"
					color="primary"
					onClick={handleAddPath}
					disabled={
						!newPath.name ||
						!newPath.description ||
						!newPath.image ||
						!isMapUsed
					}
				>
					Add Path
				</Button>
			</Box>
		</Box>
	);
};
