import type { MileageTarget } from '@truckermudgeon/map/types';
import type { MappedData } from '../../mapped-data';
import type { Label, LabelMeta } from '../extra-labels';
import { LabelProducer, TargetLabel } from '../extra-labels';
import * as fixtures from './extra-labels.fixtures';

type MyMappedData = Pick<MappedData, 'cities' | 'countries' | 'map'>;

const usa = {
  cities: fixtures.citiesAts,
  countries: fixtures.countriesAts,
  map: 'usa',
} as MyMappedData;

const europe = {
  cities: fixtures.citiesEts2,
  countries: fixtures.countriesEts2,
  map: 'europe',
} as MyMappedData;

function makeLabel(
  targets: Map<string, MileageTarget>,
  game: MyMappedData,
  meta?: LabelMeta[],
): Label {
  if (targets?.size != 1 && !meta) {
    throw new Error(
      `makeLabel() needs a Map with exactly 1 MileageTarget, but got ${targets?.size}`,
    );
  }
  return new LabelProducer({
    gameData: { ...game, mileageTargets: targets },
    metaData: meta,
  }).makeLabels()[0];
}

test('regular scenery town', () => {
  const meta = {
    token: 'ca_janesvill',
    text: 'Janesville',
    kind: undefined,
    easting: -102591.2,
    southing: -19511.5,
    country: 'US-CA',
    show: undefined,
  };
  const { easting, southing, ...properties } = meta;

  const label = makeLabel(fixtures.ca_janesvill, usa);
  expect(label).toBeInstanceOf(TargetLabel);
  expect(label.meta()).toEqual(meta);
  expect(label.isValid()).toBeTruthy();

  const feature = label.toGeoJsonFeature();
  expect(feature.type).toBe('Feature');
  expect(feature.geometry.coordinates[0]).toBeCloseTo(-120.1, 1);
  expect(feature.geometry.coordinates[1]).toBeCloseTo(40.0, 1);
  expect(feature.properties).toMatchObject(properties);
});

test('large distance offset hidden by default', () => {
  const label = makeLabel(fixtures.ca_napa, usa);
  expect(label.meta()).toMatchObject({
    token: 'ca_napa',
    text: 'Napa',
    access: false,
    kind: undefined,
    show: false,
  });
  expect((label as TargetLabel).analysis.tooMuchDistance).toBeTruthy();
  expect(label.isValid()).toBeTruthy();
});

describe('target label text', () => {
  test('American abbreviation trailing', () => {
    const label = makeLabel(fixtures.wa_wallula, usa);
    expect(label.meta()).toMatchObject({
      token: 'wa_wallula',
      text: 'Wallula Junction',
      kind: undefined,
      show: undefined,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('American abbreviation leading', () => {
    const label = makeLabel(fixtures.mt_stregis, usa);
    expect(label.meta()).toMatchObject({
      token: 'mt_stregis',
      text: 'Saint Regis',
      kind: undefined,
      show: undefined,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('break tag, all lowercase w/ unicode', () => {
    const label = makeLabel(fixtures.ba_bihac_, europe);
    expect(label.meta()).toMatchObject({
      token: 'ba_bihac_',
      text: 'Бихаћ',
      kind: undefined,
      show: false,
    });
    expect(label.isValid()).toBeFalsy(); // country not in dataset
  });

  test('other tag, all uppercase', () => {
    const label = makeLabel(fixtures.fr_stquentin, europe);
    expect(label.meta()).toMatchObject({
      token: 'fr_stquentin',
      text: 'St Quentin',
      kind: undefined,
      show: false,
    });
    expect(label.isValid()).toBeFalsy(); // missing position
  });
});

describe('country', () => {
  test('American states', () => {
    const labelMT = makeLabel(fixtures.mt_stregis, usa);
    const labelWA = makeLabel(fixtures.wa_wallula, usa);
    expect(labelMT.meta()).toMatchObject({
      token: 'mt_stregis',
      country: 'US-MT',
    });
    expect(labelWA.meta()).toMatchObject({
      token: 'wa_wallula',
      country: 'US-WA',
    });
  });

  test('European countries', () => {
    const labelDSIT = makeLabel(fixtures.at_klagenf, europe);
    const labelISO = makeLabel(fixtures.cz_praha_, europe);
    const labelUK = makeLabel(fixtures.uk_bristol, europe);
    expect(labelDSIT.meta()).toMatchObject({
      token: 'at_klagenf',
      country: 'AT',
    });
    expect(labelISO.meta()).toMatchObject({
      token: 'cz_praha_',
      country: 'CZ',
    });
    expect(labelUK.meta()).toMatchObject({
      token: 'uk_bristol',
      country: 'GB',
    });
  });

  test('unreleased DLC', () => {
    const labelAts = makeLabel(fixtures.unreleased_mo, usa);
    const labelEts2 = makeLabel(fixtures.unreleased_ru, europe);
    expect(labelAts.meta()).toMatchObject({
      token: 'mo_nevada',
      text: 'Nevada',
      kind: undefined,
      country: undefined,
      show: false,
    });
    expect(labelEts2.meta()).toMatchObject({
      token: 'ru_luga',
      text: 'Луга',
      kind: undefined,
      country: undefined,
      show: false,
    });
    expect(labelAts.isValid()).toBeFalsy();
    expect(labelEts2.isValid()).toBeFalsy();
  });
});

describe('marked city', () => {
  test('matched on default name', () => {
    const label = makeLabel(fixtures.ca_sanjose1, usa);
    expect(label.meta()).toMatchObject({
      token: 'ca_sanjose1',
      text: 'San Jose',
      kind: 'city',
      city: 'san_jose',
      country: 'US-CA',
      show: false,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('matched on variant name', () => {
    const label = makeLabel(fixtures.ar_ftsmith_, usa);
    expect(label.meta()).toMatchObject({
      token: 'ar_ftsmith_',
      text: 'Fort Smith',
      kind: 'city',
      city: 'fort_smith',
      country: 'US-AR',
      show: false,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('matched on all-uppercase name', () => {
    const label = makeLabel(fixtures.cz_praha_, europe);
    expect(label.meta()).toMatchObject({
      token: 'cz_praha_',
      text: 'Praha',
      kind: 'city',
      city: 'prague',
      country: 'CZ',
      show: false,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('matched on abbreviated name', () => {
    const label = makeLabel(fixtures.co_steamboat, usa);
    expect(label.meta()).toMatchObject({
      token: 'co_steamboat',
      text: 'Steamboat Springs',
      kind: 'city',
      city: 'steamboat_sp',
      country: 'US-CO',
      show: false,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('matched on ATS editor name', () => {
    const label = makeLabel(fixtures.co_colospgs, usa);
    expect(label.meta()).toMatchObject({
      token: 'co_colospgs',
      text: 'Colorado Springs',
      kind: 'city',
      city: 'colorado_spr',
      country: 'US-CO',
      show: false,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('matched on ETS2 editor name', () => {
    const label = makeLabel(fixtures.at_klagenf, europe);
    expect(label.meta()).toMatchObject({
      token: 'at_klagenf',
      text: 'Klagenfurt am Wörthersee',
      kind: 'city',
      city: 'klagenfurt',
      country: 'AT',
      show: false,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('no match across state lines', () => {
    // A city named "Sidney" does exist in `usa`, but it's the one in Montana.
    const label = makeLabel(fixtures.ne_sid, usa);
    expect(label.meta()).toMatchObject({
      token: 'ne_sid',
      text: 'Sidney',
      kind: undefined,
      city: undefined,
      country: 'US-NE',
      show: undefined,
    });
    expect(label.isValid()).toBeTruthy();
  });
});

describe('filter unnamed locations', () => {
  test('junction name with route number', () => {
    const label = makeLabel(fixtures.ca_us6x395, usa);
    expect(label.meta()).toMatchObject({
      token: 'ca_us6x395',
      kind: 'unnamed',
      show: false,
    });
    expect((label as TargetLabel).analysis).toMatchObject({
      excludeBorder: false,
      excludeJunction: true,
      excludeNumber: true,
      tooMuchDistance: false,
    });
    expect(label.isValid()).toBeFalsy();
  });

  test('route number with city name', () => {
    const label = makeLabel(fixtures.mt_sidney200, usa);
    expect(label.meta()).toMatchObject({
      token: 'mt_sidney200',
      kind: 'unnamed',
      city: 'sidney',
      show: false,
    });
    expect((label as TargetLabel).analysis).toMatchObject({
      excludeBorder: false,
      excludeJunction: false,
      excludeNumber: true,
      tooMuchDistance: true,
    });
    expect(label.isValid()).toBeFalsy();
  });

  test('route number only', () => {
    const label = makeLabel(fixtures.wa_ritzvill2, usa);
    expect(label.meta()).toMatchObject({
      token: 'wa_ritzvill2',
      kind: 'unnamed',
      show: false,
    });
    expect((label as TargetLabel).analysis).toMatchObject({
      excludeBorder: false,
      excludeJunction: false,
      excludeNumber: true,
      tooMuchDistance: false,
    });
    expect(label.isValid()).toBeFalsy();
  });

  test('state line', () => {
    const label = makeLabel(fixtures.ca_nv_sl_, usa);
    expect(label.meta()).toMatchObject({
      token: 'ca_nv_sl_',
      kind: 'unnamed',
      show: false,
    });
    expect((label as TargetLabel).analysis).toMatchObject({
      excludeBorder: true,
      excludeJunction: false,
      excludeNumber: false,
      tooMuchDistance: false,
    });
    expect(label.isValid()).toBeFalsy();
  });

  test('filter invalid labels in facade', () => {
    const data = { gameData: { mileageTargets: fixtures.ca_us6x395, ...usa } };
    expect(new LabelProducer(data).makeValidLabels().length).toBe(0);
  });
});

describe('apply metadata', () => {
  test('adjust existing label', () => {
    const meta = {
      token: 'ca_janesvill',
      easting: -102400,
      southing: -19600,
      kind: 'town',
      show: true,
    };
    const label = makeLabel(fixtures.ca_janesvill, usa, [meta]);
    expect(label.meta()).toEqual({
      text: 'Janesville', // text missing in metadata: use mileage target name
      country: 'US-CA',
      ...meta,
    });
    expect(label.isValid()).toBeTruthy();
  });

  test('make existing label invalid', () => {
    const meta = {
      token: 'ca_janesvill',
      text: undefined, // text undefined in metadata: remove label attribute
    };
    const label = makeLabel(fixtures.ca_janesvill, usa, [meta]);
    expect(label.meta()).toMatchObject({
      show: undefined, // because show isn't in the metadata
      ...meta,
    });
    expect(label.isValid()).toBeFalsy();
  });

  test('add new label', () => {
    const meta = {
      text: 'foo',
      easting: 123,
      southing: -45,
      country: 'MX',
      show: true,
    };
    const label = makeLabel(new Map(), usa, [meta]);
    expect(label.meta()).toEqual(meta);
    expect(label.isValid()).toBeTruthy();
  });

  test('empty metadata table is no-op', () => {
    const label = makeLabel(fixtures.ca_janesvill, usa, []);
    expect(label.meta()).toMatchObject({
      token: 'ca_janesvill',
    });
    expect(label.isValid()).toBeTruthy();
  });
});

describe('error checks', () => {
  test('feature without coordinates dies', () => {
    const label = makeLabel(fixtures.az_ehrenberg, usa);
    expect(label.isValid()).toBeFalsy();
    expect(() => label.toGeoJsonFeature()).toThrowError(/coordinates/);
  });
});
