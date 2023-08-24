import React, { useState } from "react";
import { AddPathForm, PathList, PathMap } from "./components";
import { Box, Button, Container, CssBaseline, Modal } from "@mui/material";
import { PathCords } from "./interfaces";
import { useJsApiLoader } from "@react-google-maps/api";

function App() {
	const [isAddPathModalOpen, setIsAddPathModalOpen] = useState(false);
	const [selectedPathId, setSelectedPathId] = useState("");
	const [selectedPathCoords, setSelectedPathCoords] = useState<PathCords[]>([]);

	const handleOpenAddPathModal = () => {
		setIsAddPathModalOpen(true);
	};

	const handleCloseAddPathModal = () => {
		setIsAddPathModalOpen(false);
	};

	const GOOGLE_MAPS_API_KEY = "AIzaSyDFBsjZSr3BENXKMXGVSG8QkV1Bn_3TJvQ";

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
		libraries: ["geometry"],
	});

	return (
		<div className="App">
			{isLoaded && (
				<Container>
					<CssBaseline />
					<PathList
						onPathSelected={(pathId, coords) => {
							setSelectedPathId(pathId);
							setSelectedPathCoords(coords);
						}}
						onOpenAddPathModal={handleOpenAddPathModal}
					/>
					{selectedPathId && selectedPathCoords.length > 0 && (
						<PathMap
							selectedPathId={selectedPathId}
							selectedPathCoords={selectedPathCoords}
							isLoaded={isLoaded}
						/>
					)}
					<Modal
						open={isAddPathModalOpen}
						onClose={handleCloseAddPathModal}
						aria-labelledby="add-path-modal"
						sx={{ backdropFilter: "blur(50px)" }}
					>
						<Box
							sx={{
								background: "#fff",
								width: "40vw",
								margin: "10px auto",
								padding: "50px",
								borderRadius: "30px",
							}}
						>
							<AddPathForm
								isOpen={isAddPathModalOpen}
								onClose={handleCloseAddPathModal}
								onAddPath={handleOpenAddPathModal}
							/>
						</Box>
					</Modal>
				</Container>
			)}
		</div>
	);
}

export default App;
