import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecruitmentList = () => {
  const [recruitments, setRecruitments] = useState([]);

  useEffect(() => {
    getRecruitments();
  }, []);

  const getRecruitments = async () => {
    const response = await axios.get("http://localhost:8000/recruitments");
    setRecruitments(response.data);
  };

  const deleteRecruitment = async (recruitmentId) => {
    await axios.delete(`http://localhost:8000/recruitments/${recruitmentId}`);
    getRecruitments();
  };

  return (
    <div>
      <h1 className="title">Rekrutmen</h1>
      <h2 className="subtitle">Data Calon Pelamar Kerja</h2>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Posisi</th>
            <th>CV</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recruitments.map((recruitment, index) => (
            <tr key={recruitment.uuid}>
              <td>{index + 1}</td>
              <td>{recruitment.position}</td>
              <td>{recruitment.cv}</td>
              <td>{recruitment.status}</td>
              <td>
                <Link
                  to={`/recruitments/edit/${recruitment.uuid}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteRecruitment(recruitment.uuid)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecruitmentList;
