import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  SERVER_FETCH_REQUEST,
  SERVER_FETCH_SUCCESS,
  SERVER_FETCH_FAIL,
  SERVER_TRANSLATION_LANGUAGES_FETCH_REQUEST,
  SERVER_TRANSLATION_LANGUAGES_FETCH_SUCCESS,
  SERVER_TRANSLATION_LANGUAGES_FETCH_FAIL,
  EXTENDED_DESCRIPTION_REQUEST,
  EXTENDED_DESCRIPTION_SUCCESS,
  EXTENDED_DESCRIPTION_FAIL,
  SERVER_DOMAIN_BLOCKS_FETCH_REQUEST,
  SERVER_DOMAIN_BLOCKS_FETCH_SUCCESS,
  SERVER_DOMAIN_BLOCKS_FETCH_FAIL,
  API_KEYS_FETCH_REQUEST,
  API_KEYS_FETCH_SUCCESS,
  API_KEYS_FETCH_FAIL,
  API_KEY_CREATE_REQUEST,
  API_KEY_CREATE_SUCCESS,
  API_KEY_CREATE_FAIL,
  API_KEY_UPDATE_REQUEST,
  API_KEY_UPDATE_SUCCESS,
  API_KEY_UPDATE_FAIL,
  API_KEY_DELETE_REQUEST,
  API_KEY_DELETE_SUCCESS,
  API_KEY_DELETE_FAIL,
} from 'mastodon/actions/server';

const initialState = ImmutableMap({
  server: ImmutableMap({
    isLoading: false,
  }),

  extendedDescription: ImmutableMap({
    isLoading: false,
  }),

  domainBlocks: ImmutableMap({
    isLoading: false,
    isAvailable: true,
    items: ImmutableList(),
  }),
  apiKeys: ImmutableMap({
    isLoading: false,
    isCreating: false,
    isDeleting: false,
    items: ImmutableList(),
  }),
});

export default function server(state = initialState, action) {
  switch (action.type) {
  case SERVER_FETCH_REQUEST:
    return state.setIn(['server', 'isLoading'], true);
  case SERVER_FETCH_SUCCESS:
    return state.set('server', fromJS(action.server)).setIn(['server', 'isLoading'], false);
  case SERVER_FETCH_FAIL:
    return state.setIn(['server', 'isLoading'], false);
  case SERVER_TRANSLATION_LANGUAGES_FETCH_REQUEST:
    return state.setIn(['translationLanguages', 'isLoading'], true);
  case SERVER_TRANSLATION_LANGUAGES_FETCH_SUCCESS:
    return state.setIn(['translationLanguages', 'items'], fromJS(action.translationLanguages)).setIn(['translationLanguages', 'isLoading'], false);
  case SERVER_TRANSLATION_LANGUAGES_FETCH_FAIL:
    return state.setIn(['translationLanguages', 'isLoading'], false);
  case EXTENDED_DESCRIPTION_REQUEST:
    return state.setIn(['extendedDescription', 'isLoading'], true);
  case EXTENDED_DESCRIPTION_SUCCESS:
    return state.set('extendedDescription', fromJS(action.description)).setIn(['extendedDescription', 'isLoading'], false);
  case EXTENDED_DESCRIPTION_FAIL:
    return state.setIn(['extendedDescription', 'isLoading'], false);
  case SERVER_DOMAIN_BLOCKS_FETCH_REQUEST:
    return state.setIn(['domainBlocks', 'isLoading'], true);
  case SERVER_DOMAIN_BLOCKS_FETCH_SUCCESS:
    return state.setIn(['domainBlocks', 'items'], fromJS(action.blocks)).setIn(['domainBlocks', 'isLoading'], false).setIn(['domainBlocks', 'isAvailable'], action.isAvailable);
  case SERVER_DOMAIN_BLOCKS_FETCH_FAIL:
    return state.setIn(['domainBlocks', 'isLoading'], false);
    case API_KEYS_FETCH_REQUEST:
      return state.setIn(['apiKeys', 'isLoading'], true);
  case API_KEYS_FETCH_SUCCESS:
    return state.setIn(['apiKeys', 'items'], fromJS(action.apiKeys))
                .setIn(['apiKeys', 'isLoading'], false);
  case API_KEYS_FETCH_FAIL:
    return state.setIn(['apiKeys', 'isLoading'], false);

  case API_KEY_CREATE_REQUEST:
    return state.setIn(['apiKeys', 'isCreating'], true);
  case API_KEY_CREATE_SUCCESS:
    return state.updateIn(['apiKeys', 'items'], items => {
      if (!ImmutableList.isList(items)) {
        items = ImmutableList();
      }
      return items.push(fromJS(action.apiKey));
    }).setIn(['apiKeys', 'isCreating'], false);
  case API_KEY_CREATE_FAIL:
    return state.setIn(['apiKeys', 'isCreating'], false);

  case API_KEY_DELETE_REQUEST:
    return state.setIn(['apiKeys', 'isDeleting'], true);
  case API_KEY_DELETE_SUCCESS:
    return state.updateIn(['apiKeys', 'items'], items => items.filterNot(item => item.get('id') === action.id))
                .setIn(['apiKeys', 'isDeleting'], false);
  case API_KEY_DELETE_FAIL:
    return state.setIn(['apiKeys', 'isDeleting'], false);
  default:
    return state;
  }
}
