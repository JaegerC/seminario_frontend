import * as actionTypes from '../actionTypes';

const complaintsDataInitialState = {
  isLoading: false,
  error: null,
  success: false,
  count: 0,
  commerce_complaints: [],
  region_complaints: [],
  department_complaints: [],
  municipality_complaints: []
}

export const complaintsData = (state = complaintsDataInitialState, action) => {
  switch (action.type) {
    case actionTypes.GET_COMPLAINT_DATA_BY_COMMERCE_REQUEST: {
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_COMMERCE_RESPONSE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        count: action.count,
        success: action.success,
        commerce_complaints: action.payload
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_COMMERCE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_REGION_REQUEST: {
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_REGION_RESPONSE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        success: action.success,
        count: action.count,
        region_complaints: action.payload
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_REGION_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_DEPARTMENT_REQUEST: {
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_DEPARTMENT_RESPONSE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        success: action.success,
        count: action.count,
        department_complaints: action.payload
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_DEPARTMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_MUNICIPALITY_REQUEST: {
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_MUNICIPALITY_RESPONSE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        success: action.success,
        count: action.count,
        municipality_complaints: action.payload
      }
    }
    case actionTypes.GET_COMPLAINT_DATA_BY_MUNICIPALITY_FAILURE: {
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