import axios from 'axios';
import * as actionTypes from '../actionTypes';
import { API_URL, routesApi } from '../../constants/api';
import { query, mutation } from 'gql-query-builder';

export function getDepartments(isLoading = true) {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_DEPARTMENTS_REQUEST,
      isLoading
    });

    return axios.post(API_URL, query({
      operation: 'getDepartments',
      variables: {},
      fields: [
        'id',
        'name',
        'region{id, name}',
        'municipalities{id, name}'
      ]
    }))
      .then(response => {
        dispatch({
          type: actionTypes.GET_DEPARTMENTS_RESPONSE,
          payload: response.data.data.getDepartments
        })
      })
      .catch(({ response }) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_DEPARTMENTS_FAILURE,
            error: response.data.error
          })
        }
      })
  }
}

export function getModules(isLoading = true) {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_SYSTEM_MODULES_REQUEST,
      isLoading
    });

    return axios.post(API_URL, query({
      operation: 'getModules',
      variables: {},
      fields: [
        'id',
        'name',
        'isActive',
        'roles{id, role_name, isAdmin, isActive}',
      ]
    }))
      .then(response => {
        dispatch({
          type: actionTypes.GET_SYSTEM_MODULES_RESPONSE,
          payload: response.data.data.getModules
        })
      })
      .catch(({ response }) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_DEPARTMENTS_FAILURE,
            error: response.data.error
          })
        }
      })
  }
}