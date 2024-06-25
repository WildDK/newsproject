import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsDetail, setNewsDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const [newComment, setNewComment] = useState('');

  const fetchComments = useCallback(async (commentIds) => {
    const commentRequests = commentIds.map((commentId) =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`)
    );
    const commentResponses = await Promise.all(commentRequests);
    const comments = await Promise.all(
      commentResponses.map(async (response) => {
        const comment = response.data;
        if (comment.kids && comment.kids.length > 0) {
          comment.replies = await fetchComments(comment.kids);
        }
        return comment;
      })
    );
    return comments;
  }, []);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      setNewsDetail(response.data);

      const commentIds = response.data.kids || [];
      const commentResponses = await fetchComments(commentIds);
      setComments(commentResponses);
    };

    fetchNewsDetail();
  }, [id, fetchComments]);

  const handleAddComment = async () => {
    const newCommentObj = {
      id: `comment_${Date.now()}`,
      by: username,
      time: Math.floor(Date.now() / 1000),
      text: newComment,
      kids: []
    };
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const handleEditComment = (commentId, newText) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, text: newText } : comment
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments(deleteComment(comments, commentId));
  };

  const deleteComment = (comments, commentId) => {
    return comments
      .filter((comment) => comment.id !== commentId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies ? deleteComment(comment.replies, commentId) : []
      }));
  };

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <li key={comment.id} className="comment">
        <div className="comment-author">By: {comment.by}</div>
        <div className="comment-date">Date: {new Date(comment.time * 1000).toLocaleString()}</div>
        <div className="comment-text" dangerouslySetInnerHTML={{ __html: comment.text }} />
        {comment.by === username && (
          <div>
            <button onClick={() => handleEditComment(comment.id, prompt('Edit your comment:', comment.text))}>
              Edit
            </button>
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <ul>
            {renderComments(comment.replies)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="container">
      {newsDetail ? (
        <div>
          <div className="news-title">{newsDetail.title}</div>
          <div className="news-meta">By: {newsDetail.by} | Date: {new Date(newsDetail.time * 1000).toLocaleString()}</div>
          <div className="news-description" dangerouslySetInnerHTML={{ __html: newsDetail.text }}></div>
          <div className="comments-section">
            <h3>Comments ({newsDetail.descendants})</h3>
            <ul>
              {renderComments(comments)}
            </ul>
            <div className="add-comment">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
              />
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
              />
              <button onClick={handleAddComment} disabled={!username || !newComment}>Add Comment</button>
            </div>
          </div>
          <Link className="newsList" to="/">Back to News List</Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NewsDetail;
