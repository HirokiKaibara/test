import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../okyakujoho';
import { ref, push } from 'firebase/database';
import './CustomerRegisterPage.css';

const CustomerRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    userId: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // パスワード確認
      if (formData.password !== formData.confirmPassword) {
        setError('パスワードが一致しません');
        return;
      }

      // 登録データの準備
      const customerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        userId: formData.userId,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      console.log('登録開始:', customerData); // デバッグ用

      // Realtime Databaseに保存
      const customersRef = ref(database, 'customers');
      const newCustomerRef = await push(customersRef, customerData);

      console.log('登録成功 - ID:', newCustomerRef.key); // デバッグ用

      // 登録成功時の処理
      alert('登録が完了しました');
      navigate('/customer-login');

    } catch (error) {
      console.error('登録エラー:', error); // デバッグ用
      setError('登録に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="customer-register-container">
      <h2>お客様情報登録</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="form-group">
            <label>お名前</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>電話番号</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ユーザーID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>パスワード（確認用）</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="button-container">
          <button type="submit" className="register-button">
            登録
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/customer-login')}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerRegisterPage;
