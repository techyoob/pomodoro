




// Core
import './App.css';
import { useEffect, useRef, useState } from 'react';

// Third Party
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

// Application
import { convertToMMSS } from './utils';





const useStyles = makeStyles((theme) => ({
  pomoToolBox:{
    backgroundColor:'#f15a56',
    flexGrow: 1,
    width:"100%",
    overflow:'hidden',
    borderRadius:'5px',
    boxShadow:'0px 0px 4px 2px #64160da6',
    zIndex:'3'
  },
  pomoBody: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    height:'150px',
  },
  statsContainer: {
    backgroundColor:'#615957',
    padding:'20px'
  },
  statItem: {
  },
  buttonContainer: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    height:'60px',
  },
  phaseBtn:{
      width:'95%',
      '&.MuiButtonBase-root': {
        backgroundColor: '#d34434',
        with:'95%',
        color:'white'
      },
      '&.MuiButtonBase-root:hover': {
        backgroundColor: '#3c52b2',
      },
      '&.MuiButtonBase-root:disabled': {
        backgroundColor: '#612940',
        color:'white'
      },
  },
  btn:{
      width:'80%',
      '&.MuiButtonBase-root': {
        with:'95%',
        color:'white'
      },
      '&.MuiButtonBase-root:hover': {
        backgroundColor: '#3c52b2',
      }
  },
  resetBtn:{
    '&.MuiButtonBase-root': {
      backgroundColor:'#faebd78a',
      border:'2px solid #4caa9a',
      color:'#4caa9a'
    },
    
  },
  startBtn: {
    '&.MuiButtonBase-root': {
      backgroundColor:'#4caa9a'
    },
    
  },
  timerContainer: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  timerEditBtn:{    
    '&.MuiButtonBase-root': {
      backgroundColor: 'transparent',
      border:'2px solid #faebd7',
      height:'60%',
      color:'white'
    },
    '&.MuiButtonBase-root:hover': {
      backgroundColor: '#d34434',
    },
  },
  dialogContainer: {
    
  },
  dailogTitleBox: {
    backgroundColor: 'yellow',
  },
  pomoOptionsBox: {
    padding:'25px',
    backgroundColor:'turquoise'
  },
  pomoOptions: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    height:'100px',
    width:'150px'
  },
}));




const pomoPhases = [
  {
    "name":"pomo",
    "time":1800
  },
  {
    "name":"short",
    "time":300
  },
  {
    "name":"long",
    "time":1500
  }
]




function App() {
  const classes = useStyles();

  const [totalWork, setTotalWork] = useState(0)
  const [totalShort, setTotalShort] = useState(0)
  const [totalLong, setTotalLong] = useState(0)

  const [isClocking, setIsClocking ] = useState(false)
  const [timesUp, setTimesUp] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)


  const [selectedPhase, setSelectedPhase] = useState(pomoPhases[0])
  const [targetPhase, setTargetPhase] = useState(pomoPhases[0])



  useEffect(()=>{

    if(isClocking){

      const timer = setInterval(()=>{

        setSelectedPhase({...selectedPhase, time:(selectedPhase.time-1)});

        if (selectedPhase.name === 'pomo'){
          setTotalWork(totalWork+1)
        } else if (selectedPhase.name === 'short') {
          setTotalShort(totalShort+1)
        } else if (selectedPhase.name === 'long') {
          setTotalLong(totalLong+1)
        }

      }, 1000)


      if(selectedPhase.time === 0){
        clearInterval(timer)
        setIsClocking(false)
        setTimesUp(true)
      }

      return () => clearInterval(timer)
    }

  },[isClocking, selectedPhase])


  const onChangePhaseTime = (value) => {
    const newTime = (selectedPhase.time > Math.abs(value) || value > 0) ?  selectedPhase.time + value : 0;
    onPhaseChange({...selectedPhase, time:newTime})
  }

  const onPhaseSelect = (phase) => {

    if(!isClocking){
      onPhaseChange(phase)
    } else {
      setTargetPhase(phase)
      setOpenConfirmation(true)
    }
  }

  const onPhaseConfirmation = (confirmed) => {
      
    if(confirmed){
      onStart()
      onPhaseChange(targetPhase) 
    }
    setOpenConfirmation(false)
  }
  
  const onPhaseChange = (phase) => {
      setSelectedPhase(phase)
  }

  const onStart = () => {
    setIsClocking(!isClocking)
  }

  const onReset = () => {
    const phase = pomoPhases.find(item => item.name === selectedPhase.name)
    setSelectedPhase(phase)
    setIsClocking(false)
  }

  const onNextPhase = (phase, start) => {
    setTimesUp(false)
    setSelectedPhase(phase)

    if(start) onStart()
  }
  
  return (
    <div className="pomo-app">
      <div className='pomo-container'>
        <Box
          className={classes.pomoToolBox} >
          <Grid container spacing={2} sx={{padding:'20px'}}>
            {pomoPhases?.map((phaseItem, i)=>{

              return(
                <Grid item xs={4} className={classes.buttonContainer} key={i}>
                  <Button
                    className={classes.phaseBtn}
                    disabled={phaseItem?.name === selectedPhase?.name ? true : false}
                    onClick = {()=>onPhaseSelect(phaseItem)}>
                      {phaseItem?.name}
                  </Button>
                </Grid>
              )
            })}
            
            <Grid item xs={12} className={classes.pomoBody} >
              <Box className={classes.timerContainer}>
                <Button  
                  className={classes.timerEditBtn}
                  onClick = {()=>onChangePhaseTime(60)}>
                    +
                </Button>
                <span style={{margin:'30px', fontSize:'50px', fontWeight:'bold'}}>
                  {convertToMMSS(selectedPhase?.time)}
                </span>
                <Button  
                  className={classes.timerEditBtn}
                  onClick = {()=>onChangePhaseTime(-60)}>
                    -
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6} className={classes.buttonContainer} >
              <Button  
                className={`${classes.startBtn} ${classes.btn}`}
                onClick = {()=>onStart()}>
                  {isClocking ? "Pause" : "Start"}
              </Button>
            </Grid>
            <Grid item xs={6} className={classes.buttonContainer} >
              <Button
                className={`${classes.resetBtn} ${classes.btn}`}
                onClick = {()=>onReset()}>
                  Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
        <div className='pomo-stats-box'>
            {!isClocking 
              ? <Grid container spacing={2} className={classes.statsContainer}>
                  <Grid item xs={6} className={classes.statItem}>
                    {`Worked `}
                  </Grid> 
                  <Grid item xs={6} className={classes.statItem}>
                    {`${convertToMMSS(totalWork) }`}
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    {`Short Breaks `}
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    {`${convertToMMSS(totalShort) }`}
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    {`Long Breaks `}
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    {`${convertToMMSS(totalLong) }`}
                  </Grid>
                </Grid>
              : ''
            } 
        </div>
        <NextPhaseDialog
          selectedPhase={selectedPhase}
          timesUp={timesUp}
          onNextPhase={onNextPhase}
        />        
        <ConfirmationDialog
          openConfirmation={openConfirmation}
          onPhaseConfirmation={onPhaseConfirmation}      
        />
      </div>
    </div>
  );
}

export default App;







const NextPhaseDialog = (props) => {
  const { onNextPhase, selectedPhase, timesUp } = props;

  
  const classes = useStyles();

  const onSelectNextPhase = (newPhase) => {
    onNextPhase(newPhase, true);
  };

  const handleClose = () => {
    onNextPhase(selectedPhase, false);
  };

  return (
    <Dialog 
      onClose={handleClose}
      open={timesUp}
      aria-labelledby="Select-next-pomo-phase"
      className={classes.dialogContainer}>
        <DialogTitle className={classes.dailogTitleBox}>Select next pomo phase</DialogTitle>
      <Grid container spacing={2} className={classes.pomoOptionsBox}>
            {pomoPhases?.map((phaseItem, i)=>{

              if(phaseItem?.name === selectedPhase?.name){
                return 
              }

              return(
                <Grid item xs={6} className={classes.pomoOptions} key={i}>
                  <Button
                    className={classes.btn}
                    onClick = {()=>onSelectNextPhase(phaseItem)}>
                      {phaseItem?.name}
                  </Button>
                </Grid>
              )
            })}
      </Grid>
    </Dialog>
  );
};



const ConfirmationDialog = (props) => {
  const { onPhaseConfirmation, openConfirmation } = props;

  const classes = useStyles();
  
  const onConfirmNextPhase = () => {
    onPhaseConfirmation(true)

  };

  const handleClose = () => {
    onPhaseConfirmation(false)
  }


  return (
    <Dialog 
      onClose={handleClose}
      open={openConfirmation}
      aria-labelledby="confirmation"
      className={classes.dialogContainer}>
        <DialogTitle className={classes.dailogTitleBox}>Are you sure you want to abort current timer?</DialogTitle>
        <Grid container spacing={2} className={classes.pomoOptionsBox}>
          <Grid item xs={6} className={classes.pomoOptions}>
            <Button
              className={classes.btn}
              onClick = {()=>onConfirmNextPhase()}>
                Yes
            </Button>
          </Grid>
          <Grid item xs={6} className={classes.pomoOptions}>
            <Button
              className={classes.btn}
              onClick = {()=>handleClose()}>
                No
            </Button>
          </Grid>
        </Grid>
    </Dialog>
  ); 
}

