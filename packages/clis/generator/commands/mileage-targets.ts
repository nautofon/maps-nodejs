import type {
  MileageTarget,
  MileageTargetFeature,
} from '@truckermudgeon/map/types';
import fs from 'fs';
import path from 'path';
import type { Argv, BuilderArguments } from 'yargs';
import { createNormalizeFeature } from '../geo-json/normalize';
import { logger } from '../logger';
import { readArrayFile } from '../read-array-file';
import { writeGeojsonFile } from '../write-geojson-file';
import { maybeEnsureOutputDir, resourcesDir, untildify } from './path-helpers';

export const command = 'mileage-targets';
export const describe =
  'Generates mileage-targets.geojson from map-parser JSON files';

export const builder = (yargs: Argv) =>
  yargs
    .option('map', {
      alias: 'm',
      describe:
        'Source map.\nSpecify multiple source maps with multiple -m arguments.',
      choices: ['usa', 'europe'] as const,
      default: ['usa'] as ('usa' | 'europe')[],
      defaultDescription: 'usa',
    })
    .option('inputDir', {
      alias: 'i',
      describe:
        'Path to dir containing source {usa,europe}-mileageTargets.json file',
      type: 'string',
      coerce: untildify,
      demandOption: true,
    })
    .option('outputDir', {
      alias: 'o',
      describe: 'Path to dir mileage-targets.geojson should be written to',
      type: 'string',
      coerce: untildify,
      demandOption: true,
    })
    .check(maybeEnsureOutputDir);

const nodeCoordsFile = path.join(resourcesDir, 'node-coords.csv');

export function handler(args: BuilderArguments<typeof builder>) {
  logger.log('creating mileage-targets.geojson...');

  const toJsonPath = (map: 'usa' | 'europe', suffix: string) =>
    path.join(args.inputDir, `${map}-${suffix}.json`);

  // Some mileage targets reference nodes that don't appear to be included in
  // the map files. Obviously this can happen for targets in unreleased DLC,
  // but for unknown reasons, it can also happen elsewhere. We try to fill in
  // any missing coordinates from a CSV file.
  const nodeCoordsByUid = new Map<string, EastingSouthing>();
  const nodeCoordsCsvLines = fs
    .readFileSync(nodeCoordsFile, 'ascii')
    .split('\n');
  for (const line of nodeCoordsCsvLines.slice(1)) {
    const [uid, e, s] = line.split(',');
    const coords = { easting: parseFloat(e), southing: parseFloat(s) };
    nodeCoordsByUid.set(uid, coords);
  }

  const targetFeatures = [args.map].flat().flatMap(map => {
    const targets = readArrayFile<MileageTarget>(
      toJsonPath(map, 'mileageTargets'),
    ).sort((a, b) => a.token.localeCompare(b.token));
    logger.start(targets.length, 'mileage targets in parser result for', map);

    const features = [];
    for (const target of targets) {
      if (target.x && target.y) {
        features.push(toTargetFeature(target));
        continue;
      }
      const nodeUid = BigInt('0x' + target.nodeUid).toString();
      const nodeCoords = nodeCoordsByUid.get(nodeUid);
      if (nodeCoords) {
        logger.info(
          'target',
          target.token + ': using stored coords from CSV file for node_uid',
          nodeUid,
        );
        features.push(
          toTargetFeature({
            ...target,
            x: nodeCoords.easting,
            y: nodeCoords.southing,
          }),
        );
      } else {
        logger.warn('target', target.token + ': no coords, node_uid', nodeUid);
      }
    }

    const normalizeFeature = createNormalizeFeature(map, 4);
    return [...features].map(normalizeFeature);
  });

  writeGeojsonFile(path.join(args.outputDir, 'mileage-targets.geojson'), {
    type: 'FeatureCollection',
    features: targetFeatures,
  });
  logger.success(targetFeatures.length, 'mileage targets written to GeoJSON');
  logger.success('done.');
}

function toTargetFeature(target: MileageTarget): MileageTargetFeature {
  if (!target.x || !target.y) {
    throw new Error(`assertion failed: ${target.token} coordinates`);
  }
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [target.x, target.y],
    },
    properties: {
      token: target.token,
      editorName: target.editorName,
      defaultName: target.defaultName,
      nameVariants: target.nameVariants.length
        ? target.nameVariants.join('; ')
        : undefined,
      distanceOffset: target.distanceOffset,
      searchRadius: target.searchRadius,
    },
  };
}

interface EastingSouthing {
  easting: number;
  southing: number;
}
