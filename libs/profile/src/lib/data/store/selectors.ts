import {createSelector} from "@ngrx/store";
import {profileFeature} from "./reducer";

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles ) => profiles
)

export const selectFilledFilters = createSelector(
  profileFeature.selectProfileFilters,
  (filters) => filters
)

export const selectProfilePageable = createSelector(
  profileFeature.selectProfileFeatureState,
  (state) => {
    return {
      page: state.page,
      size: state.size
    }
  }
)
