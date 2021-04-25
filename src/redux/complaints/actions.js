import * as actionTypes from '../actionTypes';
import axios from 'axios';
import { query } from 'gql-query-builder';
import { API_URL } from '../../constants/api';

export function getComplaintsByCommerce(variables, isLoading = true) {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_COMPLAINT_DATA_BY_COMMERCE_REQUEST,
      isLoading
    });

    return axios.post(API_URL, query({
      operation: 'getComplaintByCommerce',
      variables,
      fields: [
        'success',
        'error',
        'count',
        {
          data: [
            'id',
            'name',
            'nit',
            {
              branches: [
                'id',
                'name',
                'address',
                'number',
                {
                  complaints: [
                    'id',
                    'detail',
                    'request',
                    'doc_invoice',
                    'createdAt',
                    'updatedAt',
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
        }
      ]
    }))
      .then((response) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_COMPLAINT_DATA_BY_COMMERCE_RESPONSE,
            count: response.data.data.getComplaintByCommerce.count,
            success: response.data.data.getComplaintByCommerce.success,
            payload: response.data.data.getComplaintByCommerce.data
          });
        }
      })
      .catch(({ response }) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_COMPLAINT_DATA_BY_COMMERCE_FAILURE,
            error: response.data.error
          });
        }
      })
  }
}

export function getComplaintsByRegion(variables, isLoading = true) {
  console.log(variables)
  return dispatch => {
    dispatch({
      type: actionTypes.GET_COMPLAINT_DATA_BY_REGION_REQUEST,
      isLoading
    });

    return axios.post(API_URL, query({
      operation: 'getComplaintByRegion',
      variables,
      fields: [
        'success',
        'error',
        'count',
        {
          data: [
            'id',
            'name',
            {
              departments: [
                'id',
                'name',
                {
                  municipalities: [
                    'id',
                    'name',
                    {
                      branches: [
                        'id',
                        'name',
                        'address',
                        'number',
                        {
                          complaints: [
                            'id',
                            'detail',
                            'request',
                            'doc_invoice',
                            'createdAt',
                            'updatedAt',
                          ]
                        },
                        {
                          commerce: [
                            'id',
                            'name',
                            {
                              commerce_type: [
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
            }
          ]
        }
      ]
    }))
      .then((response) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_COMPLAINT_DATA_BY_REGION_RESPONSE,
            success: response.data.data.getComplaintByRegion.success,
            payload: response.data.data.getComplaintByRegion.data,
            count: response.data.data.getComplaintByRegion.count
          });
        }
      })
      .catch(({ response }) => {
        console.log(response)
        if (response) {
          dispatch({
            type: actionTypes.GET_COMPLAINT_DATA_BY_REGION_FAILURE,
            error: response.data.error
          });
        }
      })
  }
}

export function getComplaintsByDepartment(variables, isLoading = true) {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_COMPLAINT_DATA_BY_DEPARTMENT_REQUEST,
      isLoading
    });

    return axios.post(API_URL, query({
      operation: 'getComplaintByDepartment',
      variables,
      fields: [
        'success',
        'error',
        'count',
        {
          data: [
            'id',
            'name',
            {
              region: [
                'id',
                'name',
              ]
            },
            {
              municipalities: [
                'id',
                'name',
                {
                  branches: [
                    'id',
                    'name',
                    'address',
                    'number',
                    {
                      complaints: [
                        'id',
                        'detail',
                        'request',
                        'doc_invoice',
                        'createdAt',
                        'updatedAt',
                      ]
                    },
                    {
                      commerce: [
                        'id',
                        'name',
                        {
                          commerce_type: [
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
        }
      ]
    }))
      .then((response) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_COMPLAINT_DATA_BY_DEPARTMENT_RESPONSE,
            success: response.data.data.getComplaintByDepartment.success,
            payload: response.data.data.getComplaintByDepartment.data,
            count: response.data.data.getComplaintByDepartment.count
          });
        }
      })
      .catch(({ response }) => {
        console.log(response)
        if (response) {
          dispatch({
            type: actionTypes.GET_COMPLAINT_DATA_BY_DEPARTMENT_FAILURE,
            error: response.data.error
          });
        }
      })
  }
}

export function getComplaintsByMunicipality(variables, isLoading = true) {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_COMPLAINT_DATA_BY_MUNICIPALITY_REQUEST,
      isLoading
    });

    return axios.post(API_URL, query({
      operation: 'getComplaintByMunicipality',
      variables,
      fields: [
        'success',
        'error',
        'count',
        {
          data: [
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
            },
            {
              branches: [
                'id',
                'name',
                'address',
                'number',
                {
                  complaints: [
                    'id',
                    'detail',
                    'request',
                    'doc_invoice',
                    'createdAt',
                    'updatedAt',
                  ]
                },
                {
                  commerce: [
                    'id',
                    'name',
                    {
                      commerce_type: [
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
    }))
      .then((response) => {
        if (response) {
          dispatch({
            type: actionTypes.GET_COMPLAINT_DATA_BY_MUNICIPALITY_RESPONSE,
            success: response.data.data.getComplaintByMunicipality.success,
            count: response.data.data.getComplaintByMunicipality.count,
            payload: response.data.data.getComplaintByMunicipality.data
          });
        }
      })
      .catch(({ response }) => {
        console.log(response.data)
        if (response) {
          dispatch({
            type: actionTypes.GET_COMPLAINT_DATA_BY_MUNICIPALITY_FAILURE,
            error: response.data.error
          });
        }
      })
  }
}