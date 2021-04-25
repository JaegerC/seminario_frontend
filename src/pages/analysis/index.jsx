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
  IconButton
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import DetailsModal from './complaints/index';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import CircularLoading from '../../components/loading/circularLoading';
import {
  getComplaintsByCommerce,
  getComplaintsByRegion,
  getComplaintsByDepartment,
  getComplaintsByMunicipality
} from '../../redux/complaints/actions';
import CustomizedSnackbars from '../../components/snack/index';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

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

const Analysis = () => {
  am4core.useTheme(am4themes_animated);
  const dispatch = useDispatch();
  const chart = useRef(null);
  const classes = useStyles();
  const { departments, regions } = useSelector(state => state.departmentsReducer);
  const { commerces } = useSelector(state => state.commercesList)
  const {
    error,
    success,
    isLoading,
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
  //Modal
  const [open, setOpen] = useState(false);
  // Titles
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [chart_data, setChartData] = useState([]);
  const [complaint_count, setComplaintCount] = useState(0);
  //Snackbar
  const [open_snack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState({});
  // Complaints
  const [complaint_list, setComplaintList] = useState([]);

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
    // Handle complaints by commerce
    if (success && commerce_complaints.branches) {
      setCommId('');
      const data = [];
      let complaints_data = [];
      commerce_complaints.branches.forEach((it => {
        if (it) {
          data.push({
            name: it.name,
            complaints: it.complaints.length
          });
          if (it.complaints.length > 0) {
            it.complaints.forEach(cmp => {
              cmp['commerce_name'] = commerce_complaints.name;
              cmp['branch_name'] = it.name;
            });
          }
          complaints_data = [
            ...complaints_data,
            ...it.complaints
          ];
        }
      }))
      setComplaintList(complaints_data)
      setComplaintCount(count);
      setChartData(data);
      setType('Comercio');
      setTitle(commerce_complaints.name);
    }

    // Handle complaints by region
    if (region_complaints && region_complaints.departments) {
      setRegion('');
      const data = [];
      let complaints_data = [];
      region_complaints.departments.forEach(item => {
        let count_complaints = 0;
        if (item.municipalities) {
          item.municipalities.forEach(mun => {
            if (mun.branches && mun.branches.length > 0) {
              mun.branches.forEach(br => {
                count_complaints += br.complaints.length;
                if (br.complaints.length > 0) {
                  br.complaints.forEach(cmp => {
                    cmp['commerce_name'] = br.commerce.name;
                    cmp['branch_name'] = br.name;
                  })
                }
                complaints_data = [
                  ...complaints_data,
                  ...br.complaints
                ];
              })
            }
          })
        }
        data.push({
          name: item.name,
          complaints: count_complaints
        });
      });
      setComplaintList(complaints_data);
      setComplaintCount(count);
      setChartData(data);
      setType('Región');
      setTitle(region_complaints.name);
    }

    // Handle complaints by department
    if (department_complaints && department_complaints.municipalities) {
      setDepto('');
      const data = [];
      let complaints_data = [];
      department_complaints.municipalities.forEach(muni => {
        if (muni && muni.branches) {
          let complaints_count = 0;
          muni.branches.forEach(br => {
            if (br && br.complaints) {
              complaints_count += br.complaints.length
              if (br.complaints.length > 0) {
                br.complaints.forEach(cmp => {
                  cmp['commerce_name'] = br.commerce.name;
                  cmp['branch_name'] = br.name
                });
              }
              complaints_data = [
                ...complaints_data,
                ...br.complaints
              ]
            }
          });
          data.push({
            name: muni.name,
            complaints: complaints_count
          });
        }
      })
      setComplaintList(complaints_data);
      setComplaintCount(count);
      setChartData(data);
      setType('Departamento');
      setTitle(department_complaints.name);
    }

    // Handle complaints by municipality
    if (municipality_complaints && municipality_complaints.branches) {
      setMuni('');
      const data = [];
      let complaints_data = [];
      municipality_complaints.branches.forEach(br => {
        let complaint_count = 0;
        if (br && br.complaints) {
          complaint_count = br.complaints.length;
          if (br.complaints.length > 0) {
            br.complaints.forEach(cmp => {
              cmp['commerce_name'] = br.commerce.name;
              cmp['branch_name'] = br.name;
            })
          }
          complaints_data = {
            ...complaints_data,
            ...br.complaints
          }
        }
        data.push({
          name: br.name,
          complaints: complaint_count
        });
      })
      setComplaintList(complaints_data);
      setComplaintCount(count);
      setChartData(data);
      setType("Municipio");
      setTitle(municipality_complaints.name);
    }

    if (error) {
      setMessage({
        message: error,
        severity: "error"
      });
      setOpenSnack(true)
    }
  }, [
    success,
    count,
    commerce_complaints,
    region_complaints,
    department_complaints,
    municipality_complaints,
    type,
    title,
    error
  ])

  useEffect(() => {
    const c_chart = am4core.create("dataChart", am4charts.XYChart);
    if (chart_data) {
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
      c_chart.data = chart_data;
      chart.current = c_chart;
    }
  }, [chart_data])

  if (isLoading) {
    return <CircularLoading isLoading={isLoading} />
  }

  const handleSubmit = (e) => {
    if (typeof commId === 'string' && typeof region === 'string'
      && typeof depto === 'string' && typeof muni === 'string') {
      setMessage({
        message: "Debe seleccionar un parametro de búsqueda",
        severity: "error"
      });
      return setOpenSnack(true)
    }


    if (muni || muni !== '') {
      cleanStates()
      return dispatch(getComplaintsByMunicipality({ municipalityId: muni }));
    }

    if ((depto || depto !== '')
      /*&& (commId === '' && region === '' && muni === '')*/) {
      cleanStates();
      return dispatch(getComplaintsByDepartment({ departmentId: depto }));
    }

    if ((region || region !== '')
      /*&& (commId === '' && depto === '' && muni === '')*/) {
      cleanStates();
      return dispatch(getComplaintsByRegion({ regionId: region }));
    }

    if ((commId || commId !== '')
      /*&& (region === '' && depto === '' && muni === '')*/) {
      cleanStates();
      return dispatch(getComplaintsByCommerce({ commerceId: commId }));
    }

  }

  const cleanStates = () => {
    setType('');
    setTitle('');
    setChartData([]);
    setComplaintList([]);
    setComplaintCount(0);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  const handleOpenModal = () => {
    if (complaint_list.length > 0) {
      setOpen(true);
    } else {
      setMessage({
        message: "No existen quejas que mostrar",
        severity: "error"
      });
      setOpenSnack(true)
    }
  }
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
              <Button onClick={handleSubmit} style={{ backgroundColor: "#04619f", color: "white", width: '100px' }} >Buscar</Button>
            </Grid>
          </MuiPickersUtilsProvider>
        </div>
        <div className={classes.table_container}>
          {

            type !== '' && title !== '' && <Typography>{type}: {title}</Typography>
          }
          {

            type !== '' && title !== '' && <Typography>Número de quejas: {complaint_count}</Typography>
          }
          <div>
            <div id="dataChart" style={{ width: '100%', height: '40vh' }} ></div>
            {!isLoading && chart_data.length === 0 && <Typography style={{ padding: '2%', textAlign: 'center' }} component="h3" >No existen datos que mostrar</Typography>}
          </div>
        </div>
        {chart_data.length > 0 &&
          <IconButton onClick={handleOpenModal} >
            Detalles de quejas
            <KeyboardArrowDownIcon color="primary" fontSize="large" style={{ padding: '2%' }} />
          </IconButton>}
      </Paper>
      {open && <DetailsModal open={open} handleClose={handleCloseModal} data={complaint_list} name={`${type}: ${title}`} />}
      {open_snack && <CustomizedSnackbars message={message} setOpenSnack={setOpenSnack} open={open_snack} />}
    </div>
  )
};

export default Analysis;