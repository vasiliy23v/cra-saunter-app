export interface Path {
	id: string;
	coords: PathCords[];
	description: string;
	favorite: boolean;
	length: number;
	name: string;
	image: string;
}

export interface PathCords { latitude: number; longitude: number }