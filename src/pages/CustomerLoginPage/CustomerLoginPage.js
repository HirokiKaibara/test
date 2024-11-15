import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../okyakujoho';
import { ref, get, child } from 'firebase/database';
import './CustomerLoginPage.css';

const CustomerLoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Firebaseから顧客データを取得
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'customers'));

      if (snapshot.exists()) {
        const customers = snapshot.val();
        let isAuthenticated = false;
        let authenticatedCustomer = null;

        // 顧客データを検索してログイン認証
        Object.values(customers).forEach(customer => {
          if (customer.userId === userId && customer.password === password) {
            isAuthenticated = true;
            authenticatedCustomer = customer;
          }
        });

        if (isAuthenticated && authenticatedCustomer) {
          // ログイン成功時の処理
          localStorage.setItem('customerLoggedIn', 'true');
          localStorage.setItem('customerUserId', authenticatedCustomer.userId);
          localStorage.setItem('customerName', authenticatedCustomer.name);
          
          // カレンダーページ（ルートページ）に遷移
          navigate('/', { replace: true });
        } else {
          setError('ユーザーIDまたはパスワードが正しくありません');
        }
      } else {
        setError('ユーザー情報が見つかりません');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      setError('ログインに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="customer-login-container">
      <div className="login-content">
        <h2>お客様ログイン</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleCustomerLogin}>
          <div className="form-content">
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
          </div>
          <div className="button-container">
            <button type="submit" className="login-button">
              ログイン
            </button>
            <button 
              type="button" 
              className="register-button"
              onClick={() => navigate('/customer-register')}
            >
              新規登録
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/')}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLoginPage;