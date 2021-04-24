import React, { useEffect, useState } from 'react';
import {
  Modal,
  Fade,
  Backdrop,
  withStyles,
  makeStyles,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination
} from '@material-ui/core';
import DetailsTableHead from './detailsTableHead';
import { StyledTableCell, StyledTableRow } from '../../common/styledElements';
import { getComparator, stableSort } from '../../../functions/tableOrder';

const useStyles = makeStyles(theme => ({
  modal: {
    // marginTop: '-10%',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    padding: "1rem",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: "9999",
    opacity: 1,
    overflowX: "auto",
    overflowY: "auto",
  },
  smallModal: {
    overflowX: "auto",
    overflowY: "auto",
    display: 'block',
    padding: '10%',  // height
  },
  // agregando para el boton complex
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
  },
  image: {
    position: 'relative',
    height: 300,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        border: '4px solid currentColor',
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
  paper: {
    padding: '3%',
    // width: image.width
  },
  text: {
    color: 'rgb(0,136,204)',
    padding: '1%'
  },
  container: {
    width: '60%',
    height: '70%',
  },
  modal_content: {
    padding: '2%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    height: '15%',
    margin: 'auto',
  },
  info: {
    height: '25%'
  },
  branches: {
    // height: '60%'
  },
  name: {
    margin: 'auto',
    padding: '10px'
  },
  details_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: '25px',
    height: '50%',
    margin: 'auto'
  },
  bottom_container: {
    display: 'flex',
    justifyContent: 'row',
    paddingTop: '30px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  filters: {
    display: "flex",
    margin: "3%",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  }
}));

const CssBackdrop = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    filter: 'blur(8px)',
  }
})(Backdrop);

const DetailsModal = (props) => {
  const classes = useStyles();
  const { data } = props;
  const [complaints, setComplaints] = useState(0);
  //Table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('number');

  useEffect(() => {
    if (data && data.branches) {
      let total = 0;
      data.branches.forEach(b => {
        total += b.complaints.length;
      })
      setComplaints(total);
    } else {
      props.handleClose();
    }
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.branches.map((n) => n.nit);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const emptyRows = data && data.branches ? rowsPerPage - Math.min(rowsPerPage, data.branches.length - page * rowsPerPage) : 0;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={CssBackdrop}
      disableScrollLock={true}
      // disableBackdropClick={true}
      BackdropProps={{
        timeout: 1000,
      }}
    >
      <Fade in={props.open}>
        <Paper className={classes.container} elevation={10} >
          <div className={classes.modal_content} >
            <div className={classes.title}>
              <Typography className={classes.name} variant="h5" gutterBottom >{data.name}</Typography>
            </div>
            <div className={classes.info}>
              <div className={classes.details_container}>
                <Typography>NIT: {data.nit}</Typography>
                <Typography>Tipo de Comercio: {data.commerce_type.name}</Typography>
                <Typography>Patente: {data.trade_patent}</Typography>
              </div>
              <hr />
              <div className={classes.details_container}>
                <Typography>Sucursales: {data.branches.length}</Typography>
                <Typography>Total de quejas: {complaints}</Typography>
              </div>
            </div>
            <div className={classes.title}>
              <Typography className={classes.name} variant="h5" gutterBottom >Sucursales</Typography>
            </div>
            <div className={classes.branches}>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table" >
                  <DetailsTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={data.branches.length}
                  />
                  <TableBody>
                    {stableSort(data.branches, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.number}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.name}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.address}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.municipality.name}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.complaints.length}</StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                    {/* {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )} */}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[4]}
                component="div"
                count={Math.round(data.branches.length / rowsPerPage) === 0 ? 1 : Math.round(data.branches.length / rowsPerPage)}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </Paper>
      </Fade>
    </Modal >
  );
}

export default DetailsModal;