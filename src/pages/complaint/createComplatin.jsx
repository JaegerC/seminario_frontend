import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Typography,
  TextField,
  // withStyles
  // IconButton
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import CircularLoading from '../../components/loading/circularLoading';
import CustomizedSnackbars from '../../components/snack/index';
import { createComplaint } from '../../redux/complaints/actions';
import { CREATE_COMPLAINT_REQUEST } from '../../redux/actionTypes';
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
    margin: "50px 0 50px 0",
    flexDirection: 'row',
    justifyContent: 'space-around'
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
  },
  input_container: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '2px solid #E0E3DA',
    // background: 'red'
  }

}));

const Complaint = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { commerces, isLoading } = useSelector(state => state.commercesList);
  const { new_complaint, isLoading: loading, error } = useSelector(state => state.complaintAdded)
  const [branches, setBranches] = useState([]);

  // Inputs
  const [commId, setCommId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [detail, setDetail] = useState('');
  const [request, setRequest] = useState('');
  const [doc_invoice, setDocInvoice] = useState([]);
  //Snackbar
  const [open_snack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState({});
  // Complaints

  useEffect(() => {
    if (commId !== '') {
      const commerce = commerces.find(cmm => cmm.id === commId);
      if (commerce && commerce.branches) {
        setBranches(commerce.branches);
      }
    }
  }, [commId, commerces])

  useEffect(() => {
    if (error) {
      setMessage({
        message: error,
        severity: "error"
      });
      setOpenSnack(true);
    }

    if (new_complaint && new_complaint.id) {
      setMessage({
        message: "Queja agregada correctamente",
        severity: "success"
      });
      setOpenSnack(true)
      setCommId('');
      setBranchId('');
      setDetail('');
      setRequest('');
      setDocInvoice('');
      dispatch({
        type: CREATE_COMPLAINT_REQUEST
      })
    }
  }, [new_complaint, error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();
    const variables = {
      detail,
      request,
      doc_invoice,
      branchId
    }
    dispatch(createComplaint(variables));
  }

  if (isLoading || loading) {
    return <CircularLoading isLoading={isLoading} />
  }

  return (
    <div>
      <Paper className={classes.root}>
        <Typography component="h2" className={classes.title} >Agregar Quejas</Typography>
        <div className={classes.input_container}>
          <div className={classes.filters}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                color="primary"
                id="demo-simple-select-outlined"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                label="Detalle de queja"
              />
            </FormControl><FormControl variant="outlined" className={classes.formControl}>
              <TextField
                color="primary"
                id="demo-simple-select-outlined"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                label="Petición"
              />
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                color="primary"
                id="demo-simple-select-outlined"
                value={doc_invoice}
                onChange={(e) => setDocInvoice(e.target.value)}
                label="Factura"
              />
            </FormControl>
          </div>
          <hr />
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
                  <InputLabel id="demo-simple-select-outlined-label">Sucursal</InputLabel>
                  <Select
                    color="primary"
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    label="Region"
                  >
                    <MenuItem value="">
                      <em>Ninguna</em>
                    </MenuItem>
                    {
                      branches.length > 0 && branches.map(br => (
                        <MenuItem key={br.id} value={br.id}>{br.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                <Button onClick={handleSubmit} style={{ backgroundColor: "#04619f", color: "white", width: '200px', height: '60px' }} >Crear</Button>
              </Grid>
            </MuiPickersUtilsProvider>
          </div>

        </div>
      </Paper>
      {open_snack && <CustomizedSnackbars message={message} setOpenSnack={setOpenSnack} open={open_snack} />}
    </div>
  )
};

export default Complaint;