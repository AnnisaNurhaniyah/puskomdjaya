import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = async () => {
    const response = await axios.get("http://localhost:8000/articles");
    setArticles(response.data);
  };

  const deleteArticle = async (articleId) => {
    await axios.delete(`http://localhost:8000/articles/${articleId}`);
    getArticles();
  };

  return (
    <div>
      <h1 className="title">Artikel</h1>
      <h2 className="subtitle">List Artikel</h2>
      <Link to="/articles/add" className="button is-primary mb-2">
        Tambah
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Judul Artikel</th>
            <th>Isi</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => (
            <tr key={article.uuid}>
              <td>{index + 1}</td>
              <td>{article.title}</td>
              <td>{article.desc}</td>
              <td>
                <Link
                  to={`/articles/edit/${article.uuid}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteArticle(article.uuid)}
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

export default ArticleList;
