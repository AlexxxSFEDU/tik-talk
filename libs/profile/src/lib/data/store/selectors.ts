import {createSelector} from "@ngrx/store";
import {profileFeature, profilesFilter} from "./reducer";

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles ) => profiles
)

export const selectFilledFilters = createSelector(
  profilesFilter.selectProfileFilters,
  (filters) => filters
)
