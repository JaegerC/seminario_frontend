import React from 'react';
import { TableHead, TableRow, withStyles, TableCell, TableSortLabel } from '@material-ui/core';
import PropTypes from 'prop-types';


const headCells = [
  { id: 'doc_invoice', numeric: true, disablePadding: true, label: 'Factura' },
  { id: 'detail', numeric: false, disablePadding: false, label: 'Queja' },
  { id: 'request', numeric: false, disablePadding: false, label: 'Petición' },
  { id: 'commerce_name', numeric: false, disablePadding: false, label: 'Comercio' },
  { id: 'branch_name', numeric: true, disablePadding: false, label: 'Sucursal' },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Fecha de ingreso' }
];

const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundImage: 'linear-gradient(315deg, #738bdc 0%, #48c3eb 74%)',
    backgroundColor: '#04619f',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    borderColor: 'rgb(0,0,0)',
    padding: '10px',
  },
}))(TableCell);

const DetailsTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.id === 'modificar' ? 'center' : 'left'}
            padding="default"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

DetailsTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default DetailsTableHead;
