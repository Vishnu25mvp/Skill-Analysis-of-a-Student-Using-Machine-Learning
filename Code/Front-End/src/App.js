import React, { Component } from "react";
import { CSVLink } from "react-csv";
import { CSVReader, jsonToCSV } from "react-papaparse";
import axios from "axios";
import Table from "./components/Table/Table";
import { user_columns } from "./TableColumns";

export default class App extends Component {
  //State
  state = {
    jsonData: [],
    isDownloadable: false,
    csvData: []
  };

  //Store converted json data into state
  updateState(data) {
    let temp = [];

    for (let i = 1; i < data.length; i++) {
      let js = {};

      for (let j = 0; j < data[i].data.length; j++) {
        js[data[0].data[j] + ""] = data[i].data[j];
      }
      temp.push(js);
    }

    this.setState({ jsonData: temp });
    this.getTableList();
  }

  //convert json to csv
  convertCSV = async () => {
    console.log(this.state.jsonData);

    const result = jsonToCSV(this.state.jsonData);

    console.log("---------------------------");
    console.log(result);
    console.log("---------------------------");
  };

  //Drop csv
  handleOnDrop = (data) => {
    console.log("---------------------------");
    console.log(data);
    this.updateState(data);
    console.log("---------------------------");
  };

  //Errors
  handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  //Removing File
  handleOnRemoveFile = (data) => {
    console.log("---------------------------");
    console.log(data);
    console.log("---------------------------");
  };

  // Get prediction inputs
  async getColumns() {
    let data = [];

    this.state.jsonData.forEach((e) => {
      let temp = [];
      temp.push(Number(e["QEM_MCQ"]));
      temp.push(Number(e["EM_MCQ_PER"]));
      temp.push(Number(e["QH_MCQ"]));
      temp.push(Number(e["H_MCQ_PER"]));
      temp.push(Number(e["QEM_PS"]));
      temp.push(Number(e["EM_PS_PER"]));
      temp.push(Number(e["QH_PS"]));
      temp.push(Number(e["H_PS_PER"]));
      data.push(temp);
    });

    return data;
  }

  // Predition output as list
  async getTableList() {
    let data = await this.getColumns();

    let tech_list = await axios.post(
      "http://localhost:5000/predict",
      {
        data: data,
      },
      { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    );

    await this.convertCSV();

    let response = tech_list.data["message"];
    response = response
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll(" ", "")
      .split(",");

    let temp_json = this.state.jsonData;

    for (let i = 0; i < temp_json.length; i++) {
      console.log(temp_json[i]["PACKAGE"], "---", Math.round(response[i]));
      temp_json[i]["PACKAGE"] = Math.round(Number(response[i]));
    }

    this.setState({ jsonData: temp_json, isDownloadable: true , csvData: temp_json});
  }

  render() {
    return (
      <>
        {/* Drop box */}
        <div className="d-flex justify-content-center my-5">
          <button className="btn btn-primary " style={{ color: "black" }}>
            <CSVReader onDrop={this.handleOnDrop} onError={this.handleOnError} addRemoveButton removeButtonColor="#659cef" onRemoveFile={this.handleOnRemoveFile}>
              <span>Drop CSV file here or click to upload.</span>
            </CSVReader>
          </button>
        </div>

        {/* Download Button */}
        <div className="d-flex justify-content-center">
          <CSVLink data={this.state.csvData} separator={","}>
            <button className={ !this.state.isDownloadable ? "btn btn-danger mx-auto my-auto" : "btn btn-success mx-auto my-auto"} style={{ color: "black" }} disabled={!this.state.isDownloadable}>  
              <span>Download me</span>
            </button>
          </CSVLink>
        </div>
        {/* <CSVLink data={this.state.csvData} separator={","}><span>Download me</span></CSVLink> */}
        {
          this.state.isDownloadable ? (
            <div className="container-fluid my-5">
              <Table
                title="PACKAGE TABLE"
                data={this.state.jsonData}
                columns={user_columns}
                customCells={[]}
              />
            </div>
          ) : null
        }        
      </>
    );
  }
}
