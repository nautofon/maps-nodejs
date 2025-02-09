/**
 * @packageDocumentation
 * @see {@link LabelProducer}
 * @author nautofon
 */

import type { City, Country, MileageTarget } from '@truckermudgeon/map/types';
import type { GeoJSON } from 'geojson';
import path from 'path';
import { logger } from '../logger';
import type { MappedData } from '../mapped-data';
import { readArrayFile } from '../read-array-file';
import { createNormalizeFeature } from './normalize';
import { ets2IsoA2 } from './populated-places';

type MyMappedData =
  | MappedData
  | Pick<MappedData, 'cities' | 'countries' | 'mileageTargets' | 'map'>;

type RegionName = 'usa' | 'europe';

/**
 * A façade to this module. Offers an easy interface to create map labels
 * for whatever combination of game data and meta data you throw at it.
 *
 * @example
 * ```ts
 * const producer = new LabelProducer({
 *   gameData: LabelProducer.readMapData('path/to/parser-output', 'usa'),
 *   metaData: LabelProducer.readMetaData('path/to/meta.json'),
 * });
 * const labels   = producer.makeLabels();
 * const features = labels
 *   .filter( label => label.isValid() )
 *   .map( label => label.toGeoJsonFeature() );
 * ```
 *
 * @see {@link Label}
 */
export class LabelProducer {
  /**
   * The game data provider created from the constructor arguments.
   */
  readonly dataProvider: LabelDataProvider;

  private readonly hasMeta: boolean;

  /**
   * @param __namedParameters.gameData
   *     The {@link MappedData} to use as a primary source.
   *     It's not necessary to give the full object; it's sufficient to pick
   *     the properties `cities`, `countries`, `mileageTargets`, and `map`.
   * @param __namedParameters.metaData
   *     The metadata table to use for augmenting the labels generated from
   *     mileage targets in the game data. Optional.
   *
   * @see {@link clis/generator/mapped-data!readMapData}
   * @see {@link readMapData}
   * @see {@link readMetaData}
   */
  constructor({
    gameData,
    metaData = [],
  }: {
    gameData: MyMappedData;
    metaData?: LabelMeta[];
  }) {
    this.dataProvider = new LabelDataProvider(gameData, metaData);
    this.hasMeta = metaData.length > 0;
  }

  /**
   * Creates map labels as appropriate for the data provided to the constructor:
   * - a {@link TargetLabel} for every mileage target
   *     (augmented with metadata if provided)
   * - a {@link GenericLabel} for every new label in the metadata (if provided)
   *
   * @returns All map labels for the provided game data and metadata.
   */
  makeLabels(): Label[] {
    const labelClass = {
      usa: AtsLabel,
      europe: Ets2Label,
    }[this.dataProvider.region()];
    let labels: Label[] = this.dataProvider.mileageTargets.map(
      target => new labelClass(target, this.dataProvider),
    );

    if (this.hasMeta) {
      labels.forEach(label => this.dataProvider.assignMeta(label));
      labels = labels.concat(this.dataProvider.missingLabels(labels));
    }

    return labels;
  }

  /**
   * Like {@link makeLabels}, but additionally filters out all invalid labels.
   *
   * @returns All _valid_ map labels for the provided game data and metadata.
   */
  makeValidLabels(): Label[] {
    return this.makeLabels().filter(label => label.isValid());
  }

  /**
   * Reads game data from the parser output into memory.
   * Suitable for feeding into the {@link LabelProducer} constructor.
   *
   * @param dir    - The path of the dir containing the parser output.
   * @param region - `'europe' | 'usa'`
   *
   * @returns {@link MappedData}, restricted to just the properties needed here.
   */
  static readMapData(dir: string, region: RegionName): MyMappedData {
    return LabelDataProvider.readMapData(dir, region);
  }

  /**
   * Reads the metadata table from a file into memory.
   *
   * @param jsonPath - The path of the metadata file. Only JSON is implemented.
   *
   * @returns The metadata table as array.
   */
  static readMetaData(jsonPath: string): LabelMeta[] {
    return LabelDataProvider.readMetaData(jsonPath);
  }
}

/**
 * Metadata attributes for a map label.
 *
 * All attributes are optional. When applying metadata to labels generated
 * from mileage targets, an __undefined__ attribute (`null`) should cause
 * that attribute to be undefined in the result as well, whereas a
 * __missing__ attribute should cause the result to use the mileage target
 * data for that particular attribute.
 *
 * @see https://github.com/nautofon/ats-towns/blob/main/label-metadata.md
 */
export interface LabelMeta {
  // Meant for JSON, thus this interface must use null rather than undefined.

  /**
   * The token identifying the mileage target to apply the label attributes to.
   *
   * If missing or undefined, this object describes a new label instead.
   */
  token?: string | null;

  /**
   * The label text / feature name.
   */
  text?: string | null;

  /**
   * The adjusted easting, if any.
   *
   * Label metadata attributes use the terms easting and {@link southing} to
   * refer to `x` / `y` coordinates. These more verbose terms avoid ambiguity
   * of the coordinates' axis order and orientation. In the software project
   * "Web-based maps for ATS and ETS2", only this interface {@link LabelMeta}
   * and its implementers use these terms, in order to match the data files.
   *
   * The attributes easting and southing may be missing in metadata if the
   * position read from mileage target data is already adequate.
   */
  easting?: number | null;

  /**
   * The adjusted southing, if any.
   *
   * @see {@link easting}
   */
  southing?: number | null;

  /**
   * The kind of location this label is for.
   *
   * Possible values include `city`, `town`, `unnamed`, and several others.
   * Missing for most labels generated from new unassessed mileage targets;
   * for such labels, the best value to assume as default is probably `town`.
   *
   * Label objects of the kind `unnamed` are not suitable for map display.
   */
  kind?: string | null;

  /**
   * Describes how the name is signed at a location in the game.
   *
   * Possible values are:
   * - `all`:    Name well visible, no matter which direction you arrive from.
   * - `most`:   Name visible when arriving from a clear majority of directions.
   * - `some`:   Name visible in _some_ way, but it may not be very obvious.
   * - `remote`: Name _not_ visible on site, but it appears on distance or
   *             direction signs elsewhere.
   */
  signed?: string | null;

  /**
   * True if a core part of the named location is accessible during regular
   * gameplay.
   */
  access?: boolean | null;

  /**
   * True if the label is for a game location with deliverable industry, for
   * example a scenery town with company depots (sometimes called a "suburb").
   */
  industry?: boolean | null;

  /**
   * The SCS token of the marked city this label can be proven to be associated
   * with, if any.
   */
  city?: string | null;

  /**
   * The ISO 3166 code of the country / state / province the labeled feature
   * is located in, for example `CZ` (Czechia) or `US-NV` (Nevada).
   */
  country?: string | null;

  /**
   * True (or missing) if it's recommended to show this label on the map
   * by default. The value of this attribute is largely subjective.
   */
  show?: boolean | null;

  /**
   * The ISO 8601 date of the last time this location was checked in the game
   * (usually `YYYY-MM`).
   */
  checked?: string | null;

  /**
   * Reference to real-life information about the labeled entity.
   * Not currently used; reserved for future expansion.
   */
  ref?: unknown;

  /**
   * Note or comment about the label or its attributes.
   */
  remark?: string | null;
}

/**
 * Map label.
 *
 * In addition to the metadata attributes (which all are optional), this
 * interface defines methods that all map labels should have available.
 *
 * @see https://github.com/nautofon/ats-towns/blob/main/label-metadata.md
 */
export interface Label extends LabelMeta {
  /**
   * @returns True if the map label is considered valid for display.
   *
   * Examples for map labels that aren't valid:
   * - No coordinates are available.
   * - No label text is available (e.g. feature kind is `unnamed`).
   * - No country / state could be determined (may indicate the label is
   *      for a location in a DLC that hasn't been released).
   */
  isValid(): boolean;

  /**
   * @returns The metadata for the map label as a shallow copy of this object.
   */
  meta(): LabelMeta;

  /**
   * @returns The map label as a GeoJSON point feature.
   *
   * @throws ReferenceError if no coordinates are available.
   *
   * @see {@link isValid}
   */
  toGeoJsonFeature(): GeoJSON.Feature<GeoJSON.Point, LabelMeta>;
}

/**
 * Map label base class.
 *
 * @see https://github.com/nautofon/ats-towns/blob/main/label-metadata.md
 */
export class GenericLabel implements Label {
  protected readonly data: LabelDataProvider;

  token: string | undefined;
  text: string | undefined;
  easting: number | undefined;
  southing: number | undefined;
  kind: string | undefined;
  signed: string | undefined;
  access: boolean | undefined;
  industry: boolean | undefined;
  city: string | undefined;
  country: string | undefined;
  show: boolean | undefined;
  checked: string | undefined;
  ref: unknown;
  remark: string | undefined;

  /**
   * @param data - The game data provider for the label's region.
   */
  constructor(data: LabelDataProvider) {
    this.data = data;
  }

  meta(): LabelMeta {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...meta } = this;
    return meta;
  }

  isValid(): boolean {
    return (
      this.kind != 'unnamed' &&
      this.country != null &&
      this.text != null &&
      this.easting != null &&
      this.southing != null
    );
  }

  toGeoJsonFeature(): GeoJSON.Feature<GeoJSON.Point, LabelMeta> {
    const { easting, southing, ...meta } = this.meta();
    const position = [easting, southing];
    if (!position.every(v => v != null)) {
      throw new ReferenceError('toGeoJsonFeature(): coordinates not defined');
    }
    return this.data.normalizeFeature({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: position,
      },
      properties: meta,
    });
  }
}

/**
 * Map label generated from mileage target data.
 *
 * This abstract class contains the heuristics for analyzing mileage targets.
 * It uses the template method pattern in {@link targetAnalysis} to give
 * subclasses an opportunity for adjusting parts of that analysis to match
 * the peculiarities of each game.
 */
export abstract class TargetLabel extends GenericLabel {
  /**
   * The original {@link MileageTarget} that this label was generated from.
   * @internal
   */
  readonly target: MileageTarget;

  /**
   * Details on the mileage target analysis results.
   * @internal
   */
  readonly analysis: TargetAnalysis;

  /**
   * @param target - The {@link MileageTarget} to generate a label for.
   * @param data   - The game data provider for the target's region.
   */
  constructor(target: MileageTarget, data: LabelDataProvider) {
    super(data);
    this.target = target;
    this.analysis = this.targetAnalysis();
  }

  override meta(): LabelMeta {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { analysis, target, ...meta } = super.meta() as TargetLabel;
    return meta;
  }

  protected targetAnalysis(): TargetAnalysis {
    // Placeholder values, to be substituted with something better suited
    // by following the template below.
    const analysis: TargetAnalysis = {
      tidyName: this.target.defaultName,
      countryCode: this.target.token.substring(0, 2).toUpperCase(),
    };

    this.determineCountry(analysis);
    this.determineLabelText(analysis); // Label text is needed for city search.
    this.determineCity(analysis);
    this.determineLabelText(analysis); // Refine label text based on found city.
    this.determineExclusionReasons(analysis);
    this.determineAccessDistance(analysis);
    this.applyResults(analysis);
    if (!this.isValid()) {
      // If clients choose not to filter out non-valid labels, those should
      // at least be hidden by default.
      this.show = false;
    }
    return analysis;
  }

  protected determineCountry(analysis: TargetAnalysis): void {
    // Mileage target tokens generally begin with a two-letter country code.
    analysis.countryCode = this.target.token
      .replace(/^([a-z]{2})[a-z_].*/i, '$1')
      .toUpperCase();

    analysis.country = this.data.countryFromCode(analysis.countryCode);
  }

  protected determineCity(analysis: TargetAnalysis): void {
    // Mileage targets referring to a city can often be identified by
    // searching for a city of the same name. But mileage target names
    // tend to use varying spellings, so we need to check them all.
    analysis.city = [
      this.target.defaultName,
      ...this.target.nameVariants,
      analysis.tidyName,
    ]
      .map(name => this.data.cityFromName(name, analysis.countryCode))
      .find(city => !!city);

    analysis.cityToken = analysis.city?.token;
  }

  protected determineLabelText(analysis: TargetAnalysis): void {
    // The mileage target default name is the most reliable source overall.
    // But for cities, the name from the city dataset is actually better.
    let tidyName = (analysis.city?.name ?? this.target.defaultName)
      // Only use first line of multi-line names.
      .replace(/<br>.*/i, '')
      // Drop all other html-like tags.
      .replace(/<[^>]*>/g, '');

    // All upper case or all lower case: change to title case.
    if (
      /^\P{Lowercase_Letter}+$/u.test(tidyName) ||
      /^\P{Uppercase_Letter}+$/u.test(tidyName)
    ) {
      // JavaScript regexes don't have Unicode-aware boundary assertions;
      // (?<=^|\P{Letter}) works more or less like \b, but for Unicode text.
      tidyName = tidyName.replace(
        /(?<=^|\P{Letter})(\p{Letter})(\p{Letter}*)/gu,
        (_, first, remaining) =>
          (first as string).toUpperCase() + (remaining as string).toLowerCase(),
      );
    }
    analysis.tidyName = tidyName;
  }

  protected determineExclusionReasons(analysis: TargetAnalysis): void {
    // Some mileage targets just refer to unnamed highway junctions.
    analysis.excludeJunction = this.target.editorName.includes(' x ');
  }

  protected determineAccessDistance(analysis: TargetAnalysis): void {
    // A limit of 20 is high, but at least avoids some pathological cases.
    analysis.tooMuchDistance = this.target.distanceOffset > 20;
  }

  protected applyResults(analysis: TargetAnalysis): void {
    this.token = this.target.token;
    this.text = analysis.tidyName;
    this.easting = this.target.x;
    this.southing = this.target.y;

    if (analysis.country) {
      this.country = analysis.countryCode;
    }
    if (analysis.city) {
      this.kind = 'city';
      this.city = analysis.city.token;
      this.show = false;
    }
    if (
      analysis.excludeBorder ||
      analysis.excludeJunction ||
      analysis.excludeNumber
    ) {
      this.kind = 'unnamed';
      this.text = this.target.editorName;
    }
    if (analysis.tooMuchDistance) {
      this.access = false;
      this.show = false;
    }
  }
}

/**
 * Map label generated from American Truck Simulator mileage targets.
 *
 * Contains heuristics for ATS `editorName` practice, common American
 * abbreviations for names on road signs, exclusion of "unnamed" state line
 * and road number targets, distance offset limit, and the ISO state code.
 */
export class AtsLabel extends TargetLabel {
  protected override determineCity(analysis: TargetAnalysis): void {
    super.determineCity(analysis);

    // In ATS, the mileage target editor name of cities is usually exactly
    // the city name with the state abbreviation in front of it.
    const cityByEditorName = this.data.cityFromName(
      this.target.editorName.replace(
        new RegExp(`^${analysis.countryCode} `),
        '',
      ),
      analysis.countryCode,
    );

    if (cityByEditorName) {
      analysis.city = cityByEditorName;
      analysis.cityTokenEditorName = cityByEditorName.token;
    }
  }

  protected override determineLabelText(analysis: TargetAnalysis): void {
    super.determineLabelText(analysis);

    // If signs in the game world abbreviate a name, but the name can reasonably
    // be spelled out in full, the `text` should also be spelled out in full.
    analysis.tidyName = analysis.tidyName
      .replace(/ Ck$/, ' Creek')
      .replace(/^Ft\.? /, 'Fort ')
      .replace(/ Jct$/, ' Junction')
      .replace(/ Mtn$/, ' Mountain')
      .replace(/^St\.? /, 'Saint ')
      .replace(/^So /, 'South ')
      .replace(/ Spgs$| Sprs\.$/, ' Springs');
  }

  protected override determineExclusionReasons(analysis: TargetAnalysis): void {
    super.determineExclusionReasons(analysis);

    // In ATS, some mileage targets just refer to the border between states.
    analysis.excludeBorder = this.target.nameVariants.reduce(
      (prev, name) =>
        prev ||
        new RegExp(`^(?:${analysis.countryCode} )?State Line$`).test(name),
      /(?:^| )?State Line$/.test(this.target.defaultName),
    );

    // In ATS, some mileage targets just refer to other highways.
    // This rule also catches regular names that happen to include route
    // numbers. Many such cases should be excluded, but there are exceptions,
    // e.g. Ritzville, WA. These must be fixed manually through metadata.
    analysis.excludeNumber = new RegExp(
      `\\b(?:US|I|Hwy|${analysis.countryCode})[- ]?[1-9][0-9]*[ENSW]?\\b`,
    ).test(this.target.editorName);
  }

  protected override determineAccessDistance(analysis: TargetAnalysis): void {
    // A large distance offset means that the target is far away from the town
    // it's referring to, often so far away that the town doesn't exist in the
    // game world at all. In ATS, experience suggests that this is the case
    // for all offsets > 7 and _not_ the case for most offsets < 5.
    analysis.tooMuchDistance = this.target.distanceOffset > 6;
  }

  protected override applyResults(analysis: TargetAnalysis): void {
    super.applyResults(analysis);

    if (analysis.country) {
      // The United States are currently the only country in ATS.
      // The "country code" actually identifies the state.
      this.country = 'US-' + analysis.country.code;
    }
  }
}

/**
 * Map label generated from Euro Truck Simulator 2 mileage targets.
 *
 * Contains heuristics for ETS2 `editorName` practice, distance offset limit,
 * and the ISO country code.
 */
export class Ets2Label extends TargetLabel {
  protected override determineCity(analysis: TargetAnalysis): void {
    super.determineCity(analysis);

    // In ETS2, the mileage target editor name of cities is usually exactly
    // the city token.
    const cityByEditorName = this.data.cityFromToken(
      this.target.editorName,
      analysis.countryCode,
    );

    if (cityByEditorName) {
      analysis.city = cityByEditorName;
      analysis.cityTokenEditorName = cityByEditorName.token;
    }
  }

  protected override applyResults(analysis: TargetAnalysis): void {
    super.applyResults(analysis);

    // Mileage target tokens use UK, but the ISO code is GB.
    if (this.country == 'UK') {
      this.country = 'GB';
    }
  }
}

/**
 * Details on the mileage target analysis results.
 * @internal
 */
export interface TargetAnalysis {
  /**
   * Mileage target name, tidied for use as map label text.
   */
  tidyName: string;

  /**
   * The two-letter code used by SCS to identify a state or country in the
   * mileage target's unit token. Not necessarily an ISO 3166 code.
   */
  countryCode: string;

  /**
   * The {@link Country} object for the country or state this mileage target is
   * located in. Because Country objects are only available for the "base map"
   * and released DLC, this property can be used as a proxy to determine
   * whether the mileage target location is actually accessible by players.
   * However, unreleased changes to already released DLC (such as "Texas 2.0")
   * aren't detectable this way.
   */
  country?: Country;

  /**
   * The {@link City} object for the city this mileage target represents.
   * As long as the map uses a separate data source for city labels, mileage
   * targets referring to cities need to be identified here. Doing so allows
   * filtering them to prevent duplicate names from being shown on the map.
   */
  city?: City;

  /**
   * The SCS token for {@link city}, _except_ if the city was identified using
   * the mileage target's `editorName`.
   */
  cityToken?: string;

  /**
   * The SCS token for {@link city} if the city _was_ identified using
   * the mileage target's `editorName`.
   */
  cityTokenEditorName?: string;

  /**
   * True if the mileage target seems to be for an unnamed state line crossing.
   */
  excludeBorder?: boolean;

  /**
   * True if the mileage target seems to be for an unnamed junction.
   */
  excludeJunction?: boolean;

  /**
   * True if the mileage target seems to include a highway route number,
   * which often indicates an unnamed location.
   */
  excludeNumber?: boolean;

  /**
   * True if the mileage target has a distance offset so large that the
   * feature identified by it almost certainly is not in the game at all.
   */
  tooMuchDistance?: boolean;
}

/**
 * This class gives access to parser results and to the metadata table.
 * It offers utility methods for easily querying particular aspects
 * needed for mileage target analysis.
 */
export class LabelDataProvider {
  // This class is somewhat inefficient, with nested sequential searches.
  // But we have at most a few thousand entries, so it doesn't really matter.

  /**
   * The full list of {@link MileageTarget} objects read from the parser output.
   */
  readonly mileageTargets: MileageTarget[];

  /**
   * Function to transform game coordinates to geographic coordinates.
   * Uses the precision given by {@link geographicCoordinatePrecision}.
   *
   * @param feature - A GeoJSON.Feature with (projected) game coordinates.
   *
   * @returns The modified feature, now with coordinates conforming to GeoJSON.
   *
   * @see {@link clis/generator/geo-json/normalize!createNormalizeFeature}
   */
  readonly normalizeFeature;

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  protected get geographicCoordinatePrecision(): number {
    return 4; // Meter-level precision in the scaled game world.
  }

  protected readonly gameData: MyMappedData;
  protected readonly metaData: LabelMeta[];
  protected readonly metaDataByToken: Map<string, LabelMeta>;

  /**
   * @param gameData
   *     The {@link MappedData} to use as a primary source.
   *     It's not necessary to give the full object; it's sufficient to pick
   *     the properties `cities`, `countries`, `mileageTargets`, and `map`.
   * @param metaData
   *     The metadata table to use for augmenting the labels generated from
   *     mileage targets in the game data.
   *
   * @see {@link clis/generator/mapped-data!readMapData}
   * @see {@link readMapData}
   * @see {@link readMetaData}
   */
  constructor(gameData: MyMappedData, metaData: LabelMeta[]) {
    this.gameData = gameData;
    this.metaData = metaData;

    this.metaDataByToken = new Map(metaData.map(x => [x.token ?? '', x]));
    this.metaDataByToken.delete('');

    this.mileageTargets = Array.from(this.gameData.mileageTargets.values());

    const precision = this.geographicCoordinatePrecision;
    this.normalizeFeature = createNormalizeFeature(this.region(), precision);

    logger.start(
      `${this.mileageTargets.length} mileage targets in parser result for ${this.region()}`,
    );
  }

  /**
   * Search the metadata table for a record that's applicable to the given
   * label, using the `token` attribute for matching. Assign any found
   * metadata to the given map label.
   *
   * Attributes missing in the metadata table will be ignored; for all other
   * attributes, the value from the metadata table (even the value `null`)
   * will replace any previous value in the label.
   *
   * @param label - The map label to assign metadata to.
   *
   * @see {@link LabelMeta}
   */
  assignMeta(label: Label): void {
    const meta = this.metaDataByToken.get(label.token ?? '');
    if (meta) {
      Object.assign(label, meta);
    }
  }

  /**
   * Compare the metadata table with the given list of existing map labels,
   * using the `token` attribute for matching. Return new map label instances
   * for any metadata records that have no matching existing label.
   *
   * @param existing - The label list to check (usually from mileage targets).
   *
   * @returns A list of new {@link GenericLabel} instances, created from the
   *     metadata table.
   */
  missingLabels(existing: Label[]): Label[] {
    const existingByToken = new Map(
      existing.map(label => [label.token, label]),
    );
    const missingMeta = this.metaData.filter(
      meta => !existingByToken.has(meta.token),
    );
    return missingMeta.map(meta => {
      const label = new GenericLabel(this);
      Object.assign(label, meta);
      return label;
    });
  }

  /**
   * Search for a city name in the game data for a particular country.
   *
   * @param name        - The city name to look up.
   * @param countryCode - The mileage target country to restrict the search to.
   *
   * @returns The {@link City} object, or `undefined` if none was found.
   */
  cityFromName(name: string, countryCode: string): City | undefined {
    const country = this.countryFromCode(countryCode);
    return Array.from(this.gameData.cities.values()).find(
      city =>
        country?.token == city.countryToken &&
        city.name.localeCompare(name, undefined, {
          usage: 'search',
          sensitivity: 'accent',
        }) == 0,
    );
  }

  /**
   * Search for a city token in the game data for a particular country.
   *
   * @param token       - The city token to look up.
   * @param countryCode - The mileage target country to restrict the search to.
   *
   * @returns The {@link City} object, or `undefined` if none was found.
   */
  cityFromToken(token: string, countryCode: string): City | undefined {
    const city = this.gameData.cities.get(token);

    // Verify the country as a sanity check.
    const country = this.countryFromCode(countryCode);
    return country?.token == city?.countryToken ? city : undefined;
  }

  /**
   * Search for a mileage target token country code in the game data.
   *
   * Country codes in mileage target tokens mostly follow ISO 3166
   * (but UK is used for Great Britain and XK for Kosovo).
   * In the game data, ATS uses ISO subdivisions for country codes, while
   * ETS2 uses the Distinguishing Sign of Vehicles in International Traffic.
   *
   * @param code - The mileage target country code to look up.
   *
   * @returns The {@link Country} object, or `undefined` if none was found.
   *
   * @see {@link clis/generator/geo-json/populated-places!ets2IsoA2}
   */
  countryFromCode(code: string): Country | undefined {
    return Array.from(this.gameData.countries.values()).find(
      country =>
        ets2IsoA2.get(country.code) == code ||
        country.code == code ||
        // The ISO and DSIT codes are GB, but mileage target tokens use UK.
        (country.code == 'GB' && code == 'UK'),
    );
  }

  /**
   * The name of the region for which game data is provided.
   *
   * @returns `'europe' | 'usa'`
   */
  region(): RegionName {
    return this.gameData.map;
  }

  /**
   * Reads game data from the parser output into memory.
   * Suitable for feeding into the {@link LabelDataProvider} constructor.
   *
   * @param dir    - The path of the dir containing the parser output.
   * @param region - `'europe' | 'usa'`
   *
   * @returns {@link MappedData}, restricted to just the properties needed here.
   */
  static readMapData(dir: string, region: RegionName): MyMappedData {
    const arrayFileByToken = <T extends { token: string }>(
      dataset: string,
    ): Map<string, T> => {
      const jsonPath = path.join(dir, `${region}-${dataset}.json`);
      return new Map(readArrayFile<T>(jsonPath).map(x => [x.token, x]));
    };

    return {
      cities: arrayFileByToken<City>('cities'),
      countries: arrayFileByToken<Country>('countries'),
      mileageTargets: arrayFileByToken<MileageTarget>('mileageTargets'),
      map: region,
    };
  }

  /**
   * Reads the metadata table from a file into memory.
   *
   * @param jsonPath - The path of the metadata file. Only JSON is implemented.
   *
   * @returns The metadata table as array.
   */
  static readMetaData(jsonPath: string): LabelMeta[] {
    return readArrayFile<LabelMeta>(jsonPath);
  }
}
