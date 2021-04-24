import * as actionTypes from '../actionTypes';

const commerceDataInitialState = {
  isLoading: false,
  error: null,
  success: false,
  commerce_data: []
}

export const commerceData = (state = commerceDataInitialState, action) => {
  switch (action.type) {
    case actionTypes.GET_COMMERCE_DATA_BY_FILTER_REQUEST:
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }

    case actionTypes.GET_COMMERCE_DATA_BY_FILTER_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: action.success,
        commerce_data: action.payload
      }

    case actionTypes.GET_COMMERCE_DATA_BY_FILTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }

    case actionTypes.GET_COMMERCE_DATA_BY_FILTER_RESET:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: false,
        commerce_data: {}
      }

    default:
      return state;
  }
}

const commerceListInitialState = {
  isLoading: false,
  error: null,
  commerces: []
}

export const commercesList = (state = commerceListInitialState, action) => {
  switch (action.type) {
    case actionTypes.GET_COMMERCE_LIST_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case actionTypes.GET_COMMERCE_LIST_RESPONSE: {
      return {
        ...state,
        isLoading: false,
        commerces: action.payload
      }
    }
    case actionTypes.GET_COMMERCE_LIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    default:
      return state;
  }
}