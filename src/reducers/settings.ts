import {
  SET_TABOO_SET,
  SET_SINGLE_CARD_VIEW,
  SET_ALPHABETIZE_ENCOUNTER_SETS,
  SET_LANGUAGE_CHOICE,
  SetTabooSetAction,
  SetSingleCardViewAction,
  SetAlphabetizeEncounterSetsAction,
  SetLanguageChoiceAction,
  CardFetchSuccessAction,
  CARD_FETCH_SUCCESS,
  SET_THEME,
  SetThemeAction,
  SET_FONT_SCALE,
  SetFontScaleAction,
  ReduxMigrationAction,
  REDUX_MIGRATION,
} from '@actions/types';

interface SettingsState {
  tabooId?: number;
  singleCardView?: boolean;
  alphabetizeEncounterSets?: boolean;
  lang?: string;
  theme?: 'dark' | 'light';
  fontScale?: number;

  version?: number;
}
export const CURRENT_REDUX_VERSION = 1;

const DEFAULT_SETTINGS_STATE: SettingsState = {
  tabooId: undefined,
  singleCardView: false,
  alphabetizeEncounterSets: false,
  lang: 'system',
  fontScale: undefined,
  version: CURRENT_REDUX_VERSION,
};

type SettingAction = SetLanguageChoiceAction | SetTabooSetAction | SetSingleCardViewAction | SetAlphabetizeEncounterSetsAction | CardFetchSuccessAction | SetThemeAction | SetFontScaleAction | ReduxMigrationAction;


export default function(
  state: SettingsState = DEFAULT_SETTINGS_STATE,
  action: SettingAction
): SettingsState {
  switch (action.type) {
    case REDUX_MIGRATION:
      return {
        ...state,
        version: action.version,
      };
    case SET_FONT_SCALE:
      return {
        ...state,
        fontScale: action.fontScale,
      };
    case SET_THEME: {
      return {
        ...state,
        theme: action.theme === 'system' ? undefined : action.theme,
      };
    }
    case SET_LANGUAGE_CHOICE: {
      return {
        ...state,
        lang: action.choiceLang,
      };
    }
    case SET_TABOO_SET: {
      return {
        ...state,
        tabooId: action.tabooId,
      };
    }
    case SET_ALPHABETIZE_ENCOUNTER_SETS:
      return {
        ...state,
        alphabetizeEncounterSets: action.alphabetizeEncounterSets,
      };
    case SET_SINGLE_CARD_VIEW: {
      return {
        ...state,
        singleCardView: action.singleCardView,
      };
    }
    case CARD_FETCH_SUCCESS: {
      return {
        ...state,
        lang: action.choiceLang,
      };
    }
    default: {
      return state;
    }
  }
}
