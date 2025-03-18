import React, { Component } from 'react';
import Web3 from 'web3';
import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  
  root: {   
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    '& .MuiButton-containedPrimary': {
      backgroundColor: '#328888',
      fontFamily: "'Roboto Condensed', sans-serif",
    },
  },
});

class Login extends Component {
  connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Request MetaMask connection
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        // Store account & redirect
        window.localStorage.setItem('web3account', account);
        window.location = '/dashboard';
      } catch (error) {
        console.error('MetaMask connection error:', error);
        window.alert('MetaMask connection failed.');
      }
    } else {
      window.alert('MetaMask is not installed. Please install MetaMask to continue.');
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="profile-bg">
        <Container className={classes.root}>
          <div className="login-text">User Login</div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={this.connectMetaMask}
            >
              Login with MetaMask
            </Button>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
