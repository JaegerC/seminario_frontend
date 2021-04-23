import axios from 'axios';
import * as actionTypes from '../actionTypes';
import { API_URL, routesApi } from '../../constants/api';
import { query } from 'gql-query-builder';

export function getCommerceByFilter(variables, isLoading = true) {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_METRICS_HISTORICAL_BY_FILTER_REQUEST,
      isLoading
    });
    console.log(variables)
    return axios.post(API_URL, query({
      operation: 'getCommerceByFilter',
      variables,
      fields: [
        'data'
      ]
    }))
      .then(response => {
        console.log(response.data.data)
        if (response) {
          dispatch({
            type: actionTypes.GET_METRICS_HISTORICAL_BY_FILTER_RESPONSE,
            payload: response.data.data,
            // success: response.data.success
          })
        }
      })
      .catch(({ response }) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_METRICS_HISTORICAL_BY_FILTER_FAILURE,
            error: response.data.error
          })
        }
      });
  }
}