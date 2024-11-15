import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getUsers, 
  saveUsers, 
  getCurrentUser, 
  isLoggedIn 
} from '../../utils/storageUtils';
import { ADMIN_USER } from '../../constants/config';
import '../../styles/common.css';
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const userId = getCurrentUser();

    // 管理者のパスワード変更制限
    if (userId === ADMIN_USER.id) {
      if (currentPassword !== ADMIN_USER.password) {
        setError('現在のパスワードが正しくありません');
        return;
      }
      setError('管理者のパスワードは変更できません');
      return;
    }

    const users = getUsers();
    if (!users[userId] || users[userId].password !== currentPassword) {
      setError('現在のパスワードが正しくありません');
      return;
    }

    if (newPassword.length < 4) {
      setError('新しいパスワードは4文字以上で入力してください');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません');
      return;
    }

    if (currentPassword === newPassword) {
      setError('新しいパスワードが現在のパスワードと同じです');
      return;
    }

    users[userId].password = newPassword;
    saveUsers(users);
    
    setSuccess('パスワードを変更しました');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      navigate('/bookings');
    }, 3000);
  };

  return (
    <div className="form-container">
      <h2>パスワード変更</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handlePasswordChange}>
        <div className="form-group">
          <label>現在のパスワード</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>新しいパスワード</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>新しいパスワード（確認）</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">変更</button>
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

export default ChangePasswordPage;
