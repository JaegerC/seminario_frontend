import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularLoading from '../../components/loading/circularLoading';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Typography,
  // TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  IconButton
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import { getCommerceByFilter } from '../../redux/commerce/actions';
import EnhancedTableHead from './enhacedTableHead';
import moment from 'moment';
import DetailsIcon from '@material-ui/icons/Details';
import DetailsModal from './details/index';
import { StyledTableCell, StyledTableRow } from '../common/styledElements';
import { getComparator, stableSort } from '../../functions/tableOrder';
import CustomizedSnackbars from '../../components/snack/index';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100vh'
  },
  container: {
    maxHeight: 440,
  },
  table_container: {
    margin: '0 20px 0 20px'
  },
  // title: {
  //   padding: '3%',
  //   textAlign: 'center',
  //   fontSize: '2rem'
  // },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '30px'
  },
  title: {
    padding: '3%',
    font: 'normal normal normal 26px/36px Open Sans',
    borderBottom: '2px solid #E0E3DA',
    opacity: 1
  },
  bottom_container: {
    display: 'flex',
    justifyContent: 'row',
    paddingTop: '30px'
  },
  botom1: {
    width: '50%',
    paddingRight: '15px'
  },
  botom2: {
    width: '50%',
    paddingLeft: '15px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    color: 'red'
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

const Search = () => {
  const distpach = useDispatch();
  const classes = useStyles();
  const { departments, regions } = useSelector(state => state.departmentsReducer);
  const { success, commerce_data, error, isLoading } = useSelector(state => state.commerceData);
  // Select data
  const [fil_region, setFilRegion] = useState([]);
  const [fil_deptos, setFilDeptos] = useState([]);
  const [fil_muni, setFilMuni] = useState([]);
  // Inputs
  const [depto, setDepto] = useState('');
  const [muni, setMuni] = useState('');
  const [region, setRegion] = useState('');
  const [comm_name, setCommName] = useState('');
  // Table  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nit');
  //Modal
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({});
  //Snackbar
  const [open_snack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setFilRegion(regions);
    setFilDeptos(departments);
    return (() => {
      setRegion('');
      setDepto('');
      setMuni('');
      setCommName('');
    })
  }, [regions, departments]);

  useEffect(() => {
    if (error) {
      setMessage({
        message: error,
        severity: "error"
      });
      setOpenSnack(true)
    }
  }, [error])

  useEffect(() => {
    if (region !== '') {
      const deptos = departments.filter(item => item.region.id === region);
      setFilDeptos(deptos)
    } else {
      setFilDeptos(departments)
    }

    if (depto !== '') {
      const munis = departments.find(item => item.id === depto);
      setFilMuni(munis.municipalities);
    } else {
      setFilMuni([]);
    }
  }, [region, depto, departments])

  if (isLoading) {
    return <CircularLoading isLoading={isLoading} />
  }

  const handleSubmit = (e) => {
    if (comm_name.trim() === "" && region === ''
      && depto === '' && muni === '') {
      setMessage({
        message: "Debe seleccionar un parametro de búsqueda",
        severity: "error"
      });
      return setOpenSnack(true);
    }

    const variables = {
      commerce_name: comm_name,
      regionId: region !== "" ? region : 0,
      departmentId: depto !== "" ? depto : 0,
      municipalityId: muni !== "" ? muni : 0
    }
    console.log(variables)
    distpach(getCommerceByFilter(variables));
    setRegion('');
    setDepto('');
    setMuni('');
    setCommName('');
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = commerce_data.map((n) => n.nit);
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

  const handleCloseModal = () => {
    setOpen(false);
  }

  const handleOpenModal = (data) => {
    setDetails(data);
    setOpen(true);
  }

  const emptyRows = commerce_data && commerce_data.length ? rowsPerPage - Math.min(rowsPerPage, commerce_data.length - page * rowsPerPage) : 0;

  return (
    <div>
      <Paper className={classes.root}>
        <Typography component="h2" className={classes.title} >Búsqueda</Typography>
        <div className={classes.filters} >
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <Grid container justify="space-around">
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Region</InputLabel>
                <Select
                  color="primary"
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  label="Region"
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {
                    fil_region.map(reg => (
                      <MenuItem key={reg.id} value={reg.id}>{reg.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Departamentos</InputLabel>
                <Select
                  color="primary"
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={depto}
                  onChange={(e) => setDepto(e.target.value)}
                  label="Departamento"
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {
                    fil_deptos.map(depart => (
                      <MenuItem key={depart.id} value={depart.id}>{depart.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Municipio</InputLabel>
                <Select
                  color="primary"
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={muni}
                  onChange={(e) => setMuni(e.target.value)}
                  label="Municipio"
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {
                    fil_muni.map(municipality => (
                      <MenuItem key={municipality.id} value={municipality.id}>{municipality.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <Button onClick={handleSubmit} style={{ backgroundColor: "#04619f", color: "white", width: '100px' }}>Buscar</Button>
            </Grid>
          </MuiPickersUtilsProvider>
        </div>
        {
          commerce_data && commerce_data.length > 0 ?
            <div className={classes.table_container}>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={commerce_data.length}
                  />
                  <TableBody>
                    {stableSort(commerce_data, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      const date = moment(row.createdAt).format("YYYY-MM-DD");
                      return (
                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.nit}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.name}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.trade_patent}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{date}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">{row.commerce_type.name}</StyledTableCell>
                          <StyledTableCell align="left" id={labelId} component="th" scope="row">
                            <IconButton onClick={() => handleOpenModal(row)} >
                              <DetailsIcon color="primary" />
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}

                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={commerce_data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
            :
            success && !isLoading ?
              <Typography style={{ padding: '2%', textAlign: 'center' }} component="h3" >No existen datos que mostrar</Typography>
              : null
        }
      </Paper>
      {open && <DetailsModal open={open} handleClose={handleCloseModal} data={details} />}
      {open_snack && <CustomizedSnackbars message={message} setOpenSnack={setOpenSnack} open={open_snack} />}
    </div>
  )
};

export default Search;