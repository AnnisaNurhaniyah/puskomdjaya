import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditRecruitment = () => {
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const updateRecruitment = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8000/recruitments/${id}`, {
        status: status
      });
      navigate("/recruitments");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };
  return (
    <div>
      <h1 className="title">Rekrutmen</h1>
      <h2 className="subtitle">Update Rekrutmen</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateRecruitment}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Status</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Status"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditRecruitment;
