class TerrainGenerator {

    static getPlane(heightMap, scale, maxHeight) {
        let width = heightMap.length;
        let height = heightMap[0].length;

        let vertices = [];
        let indices = [];

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                vertices.push(x * scale, y * scale, heightMap[x][y] * maxHeight);
                if(x < width-1 && y < height-1) {
                    indices.push(
                        y*width+x, y*width+(x+1), (y+1)*width+(x+1),
                        y*width+x, (y+1)*width+(x+1), (y+1)*width+x);
                }
            }
        }
        return { vertices: vertices, indices: indices };
    }

}