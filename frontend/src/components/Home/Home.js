import React from "react";
import Card from "../Card/Card";
import "./Home.css"

const Home = () =>{

    return (
      <div>
        <div className="searchContainer">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Search for..."
            />
            <span class="input-group-btn">
              <button class="btn btn-search" type="button">
                <i class="fa fa-search fa-fw"></i> Search
              </button>
            </span>
          </div>
        </div>

        <div className="cardContainer">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    );

}

export default Home;