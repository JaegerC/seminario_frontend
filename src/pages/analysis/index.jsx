import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
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
  // withStyles
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import DetailsModal from '../search/details/index';
import moment from 'moment';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import {
  getComplaintsByCommerce,
  getComplaintsByRegion,
  getComplaintsByDepartment,
  getComplaintsByMunicipality
} from '../../redux/complaints/actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
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

const Analysis = () => {
  am4core.useTheme(am4themes_animated);
  const dispatch = useDispatch();
  const chart = useRef(null);
  const classes = useStyles();
  const { departments, regions } = useSelector(state => state.departmentsReducer);
  const { success, commerce_data, isLoading: loading } = useSelector(state => state.commerceData);
  const { commerces } = useSelector(state => state.commercesList)
  const {
    success: successComplaints,
    count,
    commerce_complaints,
    region_complaints,
    department_complaints,
    municipality_complaints
  } = useSelector(state => state.complaintsData)
  // Select data
  const [fil_region, setFilRegion] = useState([]);
  const [fil_deptos, setFilDeptos] = useState([]);
  const [fil_muni, setFilMuni] = useState([]);
  // Inputs
  const [depto, setDepto] = useState('');
  const [muni, setMuni] = useState('');
  const [region, setRegion] = useState('');
  const [commId, setCommId] = useState('');
  // Table  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nit');
  //Modal
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({});

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
      setCommId('');
      if (chart) {
        // chart.dispose();
      }
    })
  }, [departments, regions]);

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

  useEffect(() => {
    const c_chart = am4core.create("dataChart", am4charts.XYChart);
    if (successComplaints) {
      const data = [];
      commerce_complaints.branches.forEach((it => {
        if (it) {
          data.push({
            name: it.name,
            complaints: it.complaints.length
          });
        }
      }))
      console.log(data)
      c_chart.padding(40, 40, 40, 40);
      let categoryAxis = c_chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;

      let valueAxis = c_chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;

      let series = c_chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "name";
      series.dataFields.valueX = "complaints";
      series.tooltipText = `{valueX.complaints} Quejas`
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;

      let labelBullet = series.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.horizontalCenter = "left";
      labelBullet.label.dx = 10;
      labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
      labelBullet.locationX = 1;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add("fill", function (fill, target) {
        return c_chart.colors.getIndex(target.dataItem.index);
      });

      categoryAxis.sortBySeries = series;
      c_chart.data = data;
      chart.current = c_chart
    }
  }, [successComplaints, count, commerce_complaints])

  // if (isLoading || loading) {
  //   return <CircularLoading isLoading={isLoading} />
  // }

  const handleSubmit = (e) => {
    if (typeof commId === 'string' && typeof region === 'string'
      && typeof depto === 'string' && typeof muni === 'string') {
      return console.log("Seleccionar parametros de consulta");
    }

    if ((commId || commId !== '')
      && (region === '' && depto === '' && muni === '')) {
      dispatch(getComplaintsByCommerce({ commerceId: commId }));
    }

    if ((region || region !== '')
      && (commId === '' && depto === '' && muni === '')) {
      dispatch(getComplaintsByRegion({ regionId: region }));
    }

    if ((depto || depto !== '')
      && (commId === '' && region === '' && muni === '')) {
      dispatch(getComplaintsByDepartment({ departmentId: depto }));
    }

    if (muni || muni !== '') {
      dispatch(getComplaintsByMunicipality({ municipalityId: muni }));
    }

    setRegion('');
    setDepto('');
    setMuni('');
    setCommId('');
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, commerce_data.length - page * rowsPerPage);

  return (
    <div>
      <Paper className={classes.root}>
        <Typography component="h2" className={classes.title} >Analisis</Typography>
        <div className={classes.filters} >
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <Grid container justify="space-around">
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Comercio</InputLabel>
                <Select
                  color="primary"
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={commId}
                  onChange={(e) => setCommId(e.target.value)}
                  label="Region"
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {
                    commerces.length > 0 && commerces.map(comm => (
                      <MenuItem key={comm.id} value={comm.id}>{comm.name}</MenuItem>
                    ))
                  }
                </Select>
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
        {
          commerce_data.length > 0 ?
            <div className={classes.table_container}>
              {/* <div>
                <div id="dataChart" style={{ width: '100%', height: '40vh' }} ></div>
              </div> */}
            </div>
            :
            success && !loading ?
              <Typography style={{ padding: '2%', textAlign: 'center' }} component="h3" >No existen datos que mostrar</Typography>
              : null
        }
        <div className={classes.table_container}>
          <div>
            <div id="dataChart" style={{ width: '100%', height: '40vh' }} ></div>
          </div>
        </div>
      </Paper>
      {open && <DetailsModal open={open} handleClose={handleCloseModal} data={details} />}
    </div>
  )
};

export default Analysis;