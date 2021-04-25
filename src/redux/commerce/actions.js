import axios from 'axios';
import * as actionTypes from '../actionTypes';
import { API_URL } from '../../constants/api';
import { query } from 'gql-query-builder';

export function getCommerceByFilter(variables, isLoading = true) {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_COMMERCE_DATA_BY_FILTER_REQUEST,
      isLoading
    });
    return axios.post(API_URL, query({
      operation: 'getCommerceByFilter',
      variables,
      fields: [
        'success',
        {
          data: [
            'id',
            'name',
            'trade_patent',
            'nit',
            'is_active',
            'createdAt',
            'updatedAt',
            {
              commerce_type: [
                'id',
                'name'
              ]
            },
            {
              branches: [
                'id',
                'name',
                'address',
                'number',
                'is_active',
                'createdAt',
                'updatedAt',
                {
                  complaints: [
                    'id',
                    'detail',
                    'request',
                    'doc_invoice',
                    'createdAt',
                    'updatedAt'
                  ]
                },
                {
                  municipality: [
                    'id',
                    'name',
                    {
                      department: [
                        'id',
                        'name',
                        {
                          region: [
                            'id',
                            'name'
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        'error'
      ]
    }))
      .then(response => {
        if (response) {
          dispatch({
            type: actionTypes.GET_COMMERCE_DATA_BY_FILTER_RESPONSE,
            payload: response.data.data.getCommerceByFilter.data,
            success: response.data.data.getCommerceByFilter.success
          })
        }
      })
      .catch(({ response }) => {
        console.log(response.data)
        if (response) {
          dispatch({
            type: actionTypes.GET_COMMERCE_DATA_BY_FILTER_FAILURE,
            error: response.data.error
          })
        }
      });
  }
}

export function getCommerces(isLoading = true) {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_COMMERCE_LIST_REQUEST,
      isLoading
    });

    return axios.post(API_URL, query({
      operation: 'getCommerces',
      variables: {},
      fields: ['id', 'name']
    }))
      .then((response) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_COMMERCE_LIST_RESPONSE,
            payload: response.data.data.getCommerces
          });
        }
      })
      .catch(({ response }) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_COMMERCE_LIST_FAILURE,
            error: response.data.error
          })
        }
      })
  }
}