import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import landTopology from 'world-atlas/land-110m.json'

const land = feature(landTopology, landTopology.objects.land)

/** Continentes do planeta (Natural Earth 1:110m), para o globo. */
export const LAND: FeatureCollection<Geometry> | Feature<Geometry> = land
