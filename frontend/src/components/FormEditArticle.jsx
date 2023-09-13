import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditArticle = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getArticleById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/article/${id}`
        );
        setTitle(response.data.title);
        setDesc(response.data.desc);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getArticleById();
  }, [id]);

  const updateArticle = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8000/articles/${id}`, {
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
      <h2 className="subtitle">Edit Artikel</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateArticle}>
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

export default FormEditArticle;
