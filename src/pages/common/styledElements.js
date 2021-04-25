import { withStyles, TableCell, TableRow } from '@material-ui/core';

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'rgb(0,136,204)',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    borderColor: '#04619f',
    padding: '15px',
  },
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);