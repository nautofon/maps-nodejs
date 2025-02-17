import type { LabelMeta } from '@truckermudgeon/map/types';
import fs from 'fs';
import type { GeoJSON } from 'geojson';
import os from 'os';
import path from 'path';
import { describe, expect, test, vi } from 'vitest';
import yargs from 'yargs';
import * as extraLabels from '../../commands/extra-labels';
import { logger } from '../../logger';
import * as fixtures from './extra-labels.fixtures';

describe('command-line interface', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vitest-maps-'));
  const metaInPath = path.join(tmpDir, 'meta.json');
  const metaOutPath = path.join(tmpDir, 'extra-labels.json');
  const geojsonPath = path.join(tmpDir, 'extra-labels.geojson');

  console.log(tmpDir);
  const mileageTargets = [
    ...Array.from(fixtures.mt_stregis.values()),
    ...Array.from(fixtures.ca_napa.values()),
  ];
  const meta = {
    text: 'Away',
    easting: -76891,
    southing: 6147,
    country: 'US-CA',
    // readMapData() in mapped-data only provides game countries referenced by
    // game cities, so in order to add a new label here, we need to give it
    // a country code that matches one of the cities in fixtures.citiesAts.
  };
  fs.writeFileSync(
    path.join(tmpDir, 'usa-cities.json'),
    JSON.stringify(Array.from(fixtures.citiesAts.values())),
  );
  fs.writeFileSync(
    path.join(tmpDir, 'usa-countries.json'),
    JSON.stringify(Array.from(fixtures.countriesAts.values())),
  );
  fs.writeFileSync(
    path.join(tmpDir, 'usa-mileageTargets.json'),
    JSON.stringify(mileageTargets),
  );
  fs.writeFileSync(metaInPath, JSON.stringify([meta]));

  const cli = yargs().command(extraLabels);

  test('dry run on no output dir', () => {
    const loggerFail = vi.spyOn(logger, 'fail');
    cli.parseSync(`extra-labels --inputDir ${tmpDir}`);
    expect(loggerFail).toHaveBeenCalledWith(
      'argument "outputDir" not given; dry run only',
    );
    expect(fs.existsSync(metaOutPath)).toBeFalsy();
    expect(fs.existsSync(geojsonPath)).toBeFalsy();
  });

  test('metadata in, geojson out', () => {
    cli.parseSync(`extra-labels -i ${tmpDir} -o ${tmpDir} -t ${metaInPath}`);
    const geojson = JSON.parse(
      fs.readFileSync(geojsonPath, 'utf-8'),
    ) as GeoJSON.FeatureCollection<GeoJSON.Point, LabelMeta>;
    expect(geojson.features.length).toBe(3);
    expect(geojson.features[0].type).toBe('Feature');
    expect(geojson.features[0].geometry.coordinates[0]).toBeCloseTo(-114.6, 1);
    expect(geojson.features[0].geometry.coordinates[1]).toBeCloseTo(47.3, 1);
    expect(geojson.features[0].properties).toEqual({
      token: 'mt_stregis',
      text: 'Saint Regis',
      country: 'US-MT',
    });
    expect(geojson.features[1].properties.token).toEqual('ca_napa');
    expect(geojson.features[2].type).toBe('Feature');
    expect(geojson.features[2].geometry.coordinates[0]).toBeCloseTo(-113.1, 1);
    expect(geojson.features[2].geometry.coordinates[1]).toBeCloseTo(36.6, 1);
    expect(geojson.features[2].properties).toEqual({
      text: 'Away',
      country: 'US-CA',
    });
  });

  test('analysis out', () => {
    cli.parseSync(`extra-labels -i ${tmpDir} -o ${tmpDir} --json`);
    const metaRecords = JSON.parse(
      fs.readFileSync(metaOutPath, 'utf-8'),
    ) as LabelMeta[];
    expect(metaRecords.length).toBe(2);
    expect(metaRecords[0].token).toEqual('ca_napa');
    expect(metaRecords[1]).toEqual({
      token: 'mt_stregis',
      text: 'Saint Regis',
      easting: -71262.27,
      southing: -53983.75,
      country: 'US-MT',
    });
  });

  test('clean up temp files', () => {
    fs.rmSync(tmpDir, { recursive: true });
    expect(fs.existsSync(tmpDir)).toBeFalsy();
  });
});
