import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddArticle = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveArticle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/articles", {
        title: title,
        desc: desc
      });
      navigate("/articles");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Artikel</h1>
      <h2 className="subtitle">Tambah Artikel Baru</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveArticle}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Judul</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Judul Artikel"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Isi</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Isi Artikel"
                  />
                </div>
              </div>
              

              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Save
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

export default FormAddArticle;
