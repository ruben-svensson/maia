export type Point1D = { x: number; }
export type Point2D = { x: number; y: number; }
export type Point3D = { x: number; y: number; z: number; }
export type LineSegment<T> = { start: T; end: T; }

export type PointCoordinate = { x: number; y?: number, z?: number};

export type PointCoordinatePath = {
    points: PointCoordinate[];
    duration?: number; // Optional: duration for path animation in seconds
    pointDelay?: number; // Optional: delay between points appearing
}

export type CoordinatePlane = {
    width: number; // Pixel width of the visual
    height: number; // Pixel height
    xMin: number; // Math coordinate min
    xMax: number;
    yMin: number;
    yMax: number;
};
