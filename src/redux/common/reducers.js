import * as actionTypes from '../actionTypes';

const departmentsInitialState = {
  isLoading: false,
  error: null,
  success: false,
  departments: [],
  regions: []
}

export const departmentsReducer = (state = departmentsInitialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DEPARTMENTS_REQUEST:
      return {
        ...state,
        isLoading: action.isLoading,
        error: null,
        success: false
      }

    case actionTypes.GET_DEPARTMENTS_RESPONSE:
      const data = action.payload;
      const data_region = [];
      if (data.length > 0) {
        data.forEach(item => {
          if (!data_region.find(it => it.id === item.region.id))
            data_region.push(item.region);
        })
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        departments: data,
        regions: data_region
      }

    case actionTypes.GET_DEPARTMENTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        success: false,
        error: action.error
      }

    default:
      return state
  }
}

const systemModulesInitialState = {
  isLoading: false,
  error: null,
  success: false,
  system_modules: []
}

export const systemModules = (state = systemModulesInitialState, action) => {
  switch (action.type) {
    case actionTypes.GET_SYSTEM_MODULES_REQUEST: {
      return {
        ...state,
        isLoading: action.isLoading,
        error: null,
        success: false
      }
    }

    case actionTypes.GET_SYSTEM_MODULES_RESPONSE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        system_modules: action.payload
      }
    }

    case actionTypes.GET_SYSTEM_MODULES_FAILURE: {
      return {
        ...state,
        isLoading: false,
        success: false,
        error: action.error
      }
    }

    default:
      return state
  }
}