import * as THREE from '../node_modules/three';
import { seededRandom } from '../node_modules/three/src/math/MathUtils';
class NoiseGenerator {

    seed;
    scale;
    persistence;
    lacunarity;
    octives;

    constructor(seed, scale, persistence, lacunarity, octives) {
        this.seed = seed;
        this.scale = scale;
        this.persistence = persistence;
        this.lacunarity = lacunarity;
        this.octives = octives;
    }

    getMap(start, size) {
        let noiseMap = []
        for(let x = 0; x < size.x; x++) {
            noiseMap.push([]);
            for(let y = 0; y < size.y; y++) {
                noiseMap[x].push = 0;
            }
        }

        let amplitude = 1;
        let frequency = 1;
        let octaveOffsets = [];
        let maxPossibleNoiseHeight = 0;
        for(let i = 0; i < this.octives; i++) {
            octaveOffsets.push(new THREE.Vector2(seededRandom(this.seed) * 200000-100000, seededRandom(this.seed) * 200000-100000).add(start));
            maxPossibleNoiseHeight += amplitude;
            amplitude *= this.persistence;
        }

        for(let y = 0; y < size.y; y++) {
            for(let x = 0; x < size.x; x++) {

                amplitude = 1;
                frequency = 1;
                let noiseHeight = 0;

                for(let i = 0; i < this.octives; i++) {
                    let sampleX = (x + octaveOffsets[i].x) / this.scale * frequency;
                    let sampleY = (y + octaveOffsets[i].y) / this.scale * frequency;

                    let perlinValue = noise.perlin2(sampleX, sampleY);
                    noiseHeight += perlinValue * amplitude;

                    amplitude *= this.persistence;
                    frequency *= this.lacunarity;
                }
                noiseMap[x][y] = (noiseHeight + 1) / (2 * maxPossibleNoiseHeight / 1.5);
            }
        }

        return noiseMap;
    }

}
export { NoiseGenerator };