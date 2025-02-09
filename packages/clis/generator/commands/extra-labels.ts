import fs from 'fs';
import type { GeoJSON } from 'geojson';
import path from 'path';
import type { Argv, BuilderArguments } from 'yargs';
import { logger } from '../logger';
import { writeGeojsonFile } from '../write-geojson-file';
import { maybeEnsureOutputDir, resourcesDir, untildify } from './path-helpers';

import type { LabelMeta } from '../geo-json/extra-labels';
import { LabelProducer } from '../geo-json/extra-labels';

export const command = 'extra-labels';
export const describe =
  'Generates extra-labels.geojson from map-parser JSON files';

const outFile = command;

export const builder = (yargs: Argv) =>
  yargs
    .option('map', {
      alias: 'm',
      describe:
        'Source map. Specify multiple source maps with multiple -m arguments.',
      choices: ['usa', 'europe'] as const,
      array: true,
      default: ['usa'] as ('usa' | 'europe')[],
      defaultDescription: 'usa',
    })
    .option('metaTable', {
      alias: 't',
      describe:
        'Path to labels-meta.json file (aka classification table), relative to resources dir',
      type: 'string',
      coerce: untildify,
      default: 'labels-meta.json',
      defaultDescription: 'labels-meta.json',
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
      describe: `Path to dir ${outFile}.geojson should be written to`,
      type: 'string',
      coerce: untildify,
      demandOption: true,
    })
    .option('analysis', {
      alias: 'a',
      describe: `Analysis mode: Instead of GeoJSON, write out ${outFile}.json with metadata for all targets. Useful for manual analysis when updating the metadata table.`,
      type: 'boolean',
      default: false,
    })
    .check(maybeEnsureOutputDir);

export function handler(args: BuilderArguments<typeof builder>) {
  logger.log('creating mileage-targets.geojson...');

  const labels = args.map.flatMap(map => {
    const mappedData = LabelProducer.readMapData(args.inputDir, map);
    const meta = path.resolve(resourcesDir, args.metaTable);
    return new LabelProducer(
      fs.existsSync(meta)
        ? { gameData: mappedData, metaData: LabelProducer.readMetaData(meta) }
        : { gameData: mappedData },
    ).makeLabels();
  });

  if (args.analysis) {
    const file = path.join(args.outputDir, `${outFile}.json`);

    // For raw metadata output, apply the consistent sort order:
    // https://github.com/nautofon/ats-towns/blob/main/label-metadata.md#serialization
    const json = labels
      .map(l => l.meta())
      .sort((a, b) => cmp(a.text ?? '', b.text ?? ''))
      .sort((a, b) => cmpLabelFineTuning(a, b))
      .sort((a, b) => cmp(a.country ?? '~', b.country ?? '~'));
    fs.writeFileSync(file, JSON.stringify(json, null, 2));
  } else {
    const file = path.join(args.outputDir, `${outFile}.geojson`);

    // For GeoJSON output, skip labels with incomplete data and 'unnamed' labels
    const validLabels = labels.filter(l => l.isValid());
    const json: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: validLabels.map(l => l.toGeoJsonFeature()),
    };
    console.log('TOTAL ' + json.features.length);
    writeGeojsonFile(file, json);
  }

  logger.success('done.');
}

function cmpLabelFineTuning(a: LabelMeta, b: LabelMeta): number {
  return a.country && b.country
    ? ((a.kind ?? '') == 'unnamed') == ((b.kind ?? '') == 'unnamed')
      ? 0
      : // Within each country section, gather `kind`: 'unnamed' at the bottom
        (a.kind ?? '') == 'unnamed'
        ? 1
        : -1
    : // Gather records without country code at the bottom
      a.country
      ? -1
      : b.country
        ? 1
        : // Compare records without country code by token
          cmp(a.token ?? '~', b.token ?? '~');
}

function cmp(a: string, b: string): number {
  return a > b ? 1 : a < b ? -1 : 0;
}
