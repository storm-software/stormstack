import { RELEASE_TYPES, ReleaseType, inc, parse, valid } from "semver";

export const parseVersion = (semver: string) => parse(semver);

export type SemverReleaseType = ReleaseType;
export const isRelativeVersionKeyword = (
  val: string
): val is SemverReleaseType => {
  return RELEASE_TYPES.includes(val as SemverReleaseType);
};

export const deriveNewSemverVersion = (
  currentSemverVersion: string,
  semverSpecifier: string,
  preid?: string
) => {
  if (!valid(currentSemverVersion)) {
    throw new Error(
      `Invalid semver version "${currentSemverVersion}" provided.`
    );
  }

  let newVersion = semverSpecifier;
  if (isRelativeVersionKeyword(semverSpecifier)) {
    // Derive the new version from the current version combined with the new version specifier.
    const derivedVersion = inc(currentSemverVersion, semverSpecifier, preid);
    if (!derivedVersion) {
      throw new Error(
        `Unable to derive new version from current version "${currentSemverVersion}" and version specifier "${semverSpecifier}"`
      );
    }
    newVersion = derivedVersion;
  } else {
    // Ensure the new version specifier is a valid semver version, given it is not a valid semver keyword
    if (!valid(semverSpecifier)) {
      throw new Error(
        `Invalid semver version specifier "${semverSpecifier}" provided. Please provide either a valid semver version or a valid semver version keyword.`
      );
    }
  }
  return newVersion;
};
