import React, { FC, useState } from "react";
import { CardMedia } from "@mui/material";
import { Path } from "../../interfaces";

interface PathCardProps {
	path: Path;
}
export const PathCard: FC<PathCardProps> = ({ path }) => {
	const [imageError, setImageError] = useState(false);

	const handleImageError = () => {
		setImageError(true);
	};
	const defaultURL =
		"https://liftlearning.com/wp-content/uploads/2020/09/default-image.png";

	return (
		<CardMedia
			component="img"
			sx={{
				width: "100px",
				height: "100px",
				borderRadius: "5px",
			}}
			src={imageError ? defaultURL : path.image}
			alt={path.name}
			onError={handleImageError}
		/>
	);
};
