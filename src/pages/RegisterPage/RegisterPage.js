import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUsers, isLoggedIn, getCurrentUser } from '../../utils/storageUtils';
import { ADMIN_USER } from '../../constants/config';
import '../../styles/common.css';
import './RegisterPage.css';

const RegisterPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 管理者のみアクセス可能
    if (!isLoggedIn() || getCurrentUser() !== ADMIN_USER.id) {
      navigate('/login');
    }
  }, [navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (userId === ADMIN_USER.id) {
      setError('このユーザーIDは使用できません');
      return;
    }

    if (password.length < 4) {
      setError('パスワードは4文字以上で入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    const users = getUsers();
    if (users[userId]) {
      setError('このユーザーIDは既に使用されています');
      return;
    }

    users[userId] = { password };
    saveUsers(users);
    
    setSuccess('ユーザーを登録しました');
    setUserId('');
    setPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      navigate('/bookings');
    }, 3000);
  };

  return (
    <div className="form-container">
      <h2>新規ユーザー登録</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleRegister}>
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
        <div className="form-group">
          <label>パスワード（確認）</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">登録</button>
      </form>
      <button 
        className="btn btn-secondary"
        onClick={() => navigate('/bookings')}
      >
        予約一覧に戻る
      </button>
    </div>
  );
};

export default RegisterPage;
