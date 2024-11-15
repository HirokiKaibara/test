import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, setLoginSession } from '../../utils/storageUtils';
import { ADMIN_USER } from '../../constants/config';
import '../../styles/common.css';
import './LoginPage.css';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 管理者ログイン
    if (userId === ADMIN_USER.id && password === ADMIN_USER.password) {
      setLoginSession(userId);
      navigate('/bookings');
      return;
    }

    // 一般ユーザーログイン
    const users = getUsers();
    if (!users[userId]) {
      setError('ユーザーIDが存在しません');
      return;
    }

    if (users[userId].password !== password) {
      setError('パスワードが正しくありません');
      return;
    }

    setLoginSession(userId);
    navigate('/bookings');
  };

  return (
    <div className="form-container">
      <h2>ログイン</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>ユーザーID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">ログイン</button>
      </form>
      <button 
        className="btn btn-secondary"
        onClick={() => navigate('/')}
      >
        カレンダーに戻る
      </button>
    </div>
  );
};

export default LoginPage;
