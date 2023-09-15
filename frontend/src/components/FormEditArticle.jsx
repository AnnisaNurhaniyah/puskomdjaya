import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditArticle = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
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
        setFile(response.data.image);
        setPreview(response.data.url);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getArticleById();
  }, [id]);

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  // const updateArticle = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.patch(`http://localhost:8000/articles/${id}`, {
  //       title: title,
  //       desc: desc
  //     });
  //     navigate("/articles");
  //   } catch (error) {
  //     if (error.response) {
  //       setMsg(error.response.data.msg);
  //     }
  //   }
  // };

  const updateArticle = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("desc", desc);
    try {
      await axios.patch(`http://localhost:8000/articles/${id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (error) {
      console.log(error);
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
                <label className="label">Foto</label>
                <div className="control">
                  <input
                    type="file"
                    className="file-input"
                    onChange={loadImage}
                    // value={image}
                    // onChange={(e) => setImage(e.target.value)}
                  />
                  <span className="file-cta">
                    <span className="file-label">Choose a file...</span>
                  </span>
                </div>
              </div>

              {preview ? (
            <figure className="image is-128x128">
              <img src={preview} alt="Preview Image" />
            </figure>
          ) : (
            ""
          )}

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
