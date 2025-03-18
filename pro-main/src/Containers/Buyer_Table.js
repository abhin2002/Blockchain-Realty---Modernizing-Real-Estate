import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} />;
});

// Table Columns
const columns = [
  { id: 'propertyId', label: 'Property ID', minWidth: 100 },
  { id: 'name', label: 'Full Name', minWidth: 100 },
  { id: 'laddress', label: 'Land Details', minWidth: 170 },
  { id: 'lstate', label: 'State', minWidth: 100 },
  { id: 'lcity', label: 'City', minWidth: 100 },
  { id: 'lamount', label: 'Total Amount (Rs)', minWidth: 100 },
  { id: 'document', label: 'Documents', minWidth: 100 },
  { id: 'images', label: 'Land Images', minWidth: 100 },
  { id: 'isGovtApproved', label: 'Govt. Approval Status', minWidth: 100 },
  { id: 'isAvailable', label: 'Availability', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 100 },
];

const styles = {
  root: {
    width: '100%',
  },
};

class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetList: [],
      open1: false,
      openImageDialog: false,
      images: [],
    };
  }

  // Load properties from local storage and filter only available ones
  componentDidMount = () => {
    const storedProperties = JSON.parse(localStorage.getItem('propertyData')) || [];

    // Filter out properties that are not available
    const availableProperties = storedProperties.filter(
      (property) => property.isAvailable === "Yes"
    );

    this.setState({
      assetList: availableProperties,
    });
  };

  // Handle property purchase request
  handleRequestToBuy = (id) => {
    this.setState((prevState) => {
      const updatedList = prevState.assetList.map((property) =>
        property.propertyId === id ? { ...property, isAvailable: "Requested" } : property
      );

      localStorage.setItem('propertyData', JSON.stringify(updatedList));

      return { assetList: updatedList.filter((property) => property.isAvailable === "Available") };
    });
  };

  handleViewImages = (imageArray) => {
    if (imageArray && imageArray.length > 0) {
      console.log("Images Received in handleViewImages:", imageArray); // Debugging Output
  
      this.setState({
        open1: true, // Open modal
        images: [...imageArray], // Ensure images are set correctly
      }, () => console.log("State Updated with Images: ", this.state.images)); // Debugging after state update
    } else {
      alert("No images available.");
    }
  };

  handleCloseImageDialog = () => {
    this.setState({  open1: false, images: [] });
  };

  render() {
    return (
      <Paper style={styles.root}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    <b>{column.label}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.assetList.map((row) => (
                <TableRow hover role="checkbox" key={row.propertyId}>
                  {columns.map((column) => {
                    const value = row[column.id];

                    return (
                      <TableCell key={column.id}>
                        {column.id === "document" ? (
                          row.document ? (
                            <a href={row.document} download="document.pdf">
                              View Document
                            </a>
                          ) : (
                            <span style={{ color: "gray" }}>No Document</span>
                          )
                        ) : column.id === "images" ? (  // ✅ Correct placement for View Images
                          row["imageBase64Array"] && row["imageBase64Array"].length > 0 ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                console.log("Button Clicked for Row:", row.propertyId); // Debugging
                                console.log("Images Sent to handleViewImages:", row["imageBase64Array"]); // Debugging
                                this.handleViewImages(row["imageBase64Array"]);
                              }}
                            >
                              View Images
                            </Button>
                          ) : (
                            <span style={{ color: "gray" }}>No Images</span>
                          )
                        ) : column.id === "isAvailable" ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.handleRequestToBuy(row.propertyId)}
                          >
                            Request to Buy
                          </Button>
                        ) : column.id === "actions" ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              this.setState((prevState) => ({
                                assetList: prevState.assetList.filter(
                                  (property) => property.propertyId !== row.propertyId
                                ),
                              }))
                            }
                          >
                            Remove
                          </Button>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Image Dialog */}
         {/* ✅ Add the Dialog Modal Here (After TableContainer) */}
              <Dialog
                open={this.state.open1}
                onClose={this.handleCloseImageDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
              >
                <DialogTitle id="alert-dialog-title">View Images</DialogTitle>
                <DialogContent dividers>
                  {this.state.images.length > 0 ? (
                    this.state.images.map((image, index) => (
                      <img
                        key={index}
                        src={image} // Display Base64 images correctly
                        alt={`Uploaded Image ${index + 1}`}
                        style={{
                          width: "100%",
                          maxHeight: "400px",
                          display: "block",
                          marginBottom: "10px",
                          objectFit: "contain",
                        }}
                      />
                    ))
                  ) : (
                    <p style={{ color: "red" }}>No images available</p>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseImageDialog} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
      </Paper>
    );
  }
}

export default withStyles(styles)(TableComponent);
