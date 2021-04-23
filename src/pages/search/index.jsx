import React, { useEffect, useState } from 'react';
import { getClientData, getClients } from './api';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularLoading from '../../components/loading/circularLoading';
import { Paper, FormControl, InputLabel, Select, MenuItem, Grid, Button, Typography, TextField } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import { getCommerceByFilter } from '../../redux/commerce/actions';

const columns = [
  {
    id: 'name',
    label: 'Nombre',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'lastname',
    label: 'Apellidos',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'cui',
    label: 'CUI',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'nit',
    label: 'NIT',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'phone',
    label: 'Teléfono',
    minWidth: 170,
    align: 'left'
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
    padding: '1%'
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
  }
}));

const Search = () => {
  const distpach = useDispatch();
  const classes = useStyles();
  const { departments, regions, isLoading } = useSelector(state => state.departmentsReducer);
  const [fil_region, setFilRegion] = useState([]);
  const [fil_deptos, setFilDeptos] = useState([]);
  const [fil_muni, setFilMuni] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [depto, setDepto] = useState('');
  const [muni, setMuni] = useState('');
  const [region, setRegion] = useState('');
  const [comm_name, setCommName] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setFilRegion(regions);
    setFilDeptos(departments);
  }, []);

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
  }, [region, depto])

  if (isLoading) {
    return <CircularLoading isLoading={isLoading} />
  }

  const handleSubmit = (e) => {
    if (comm_name.trim() === "" && region === 0
      && depto === 0 && muni === 0) {
      return console.log("Seleccionar parametros de consulta");
    }

    const variables = {
      commerce_name: comm_name,
      regionId: region !== "" ? region : 0,
      departmentId: depto !== "" ? depto : 0,
      municipalityId: muni !== "" ? muni : 0
    }
    distpach(getCommerceByFilter(variables))
  }

  return (
    <div>
      <Paper className={classes.root}>
        <Typography component="h2" className={classes.title} >Búsqueda</Typography>
        <div className={classes.filters} >
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <Grid container justify="space-around">
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  color="primary"
                  id="demo-simple-select-outlined"
                  value={comm_name}
                  onChange={(e) => setCommName(e.target.value)}
                  label="Nombre"
                />
              </FormControl>
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
              <Button onClick={handleSubmit} >Buscar</Button>
            </Grid>
          </MuiPickersUtilsProvider>
        </div>
        {/* <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.length > 0 && clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={clients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </div>
  )
};

export default Search;