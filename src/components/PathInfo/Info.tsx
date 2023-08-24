import React from "react";
import { Box, CardMedia, Typography } from "@mui/material";
import { Path } from "../../interfaces";

interface PathInfoProps {
	selectedPath: Path | null;
	length: number | null;
}

export const PathInfo: React.FC<PathInfoProps> = ({ selectedPath, length }) => {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
			{selectedPath && (
				<Box>
					<CardMedia
						component="img"
						sx={{
							width: "100%",
							height: "300px",
							borderRadius: "5px",
						}}
						image={selectedPath.image}
						alt={selectedPath.name}
					/>
					<Typography sx={{ fontWeight: 500 }}>Name:</Typography>
					<Typography>{selectedPath.name}</Typography>
					<Typography sx={{ fontWeight: 500 }}>About:</Typography>
					<Typography>{selectedPath.description}</Typography>
					<Typography sx={{ fontWeight: 500 }}>Length:</Typography>
					<Typography>{length}</Typography>
				</Box>
			)}
		</Box>
	);
};
