import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../okyakujoho';
import { ref, get, child } from 'firebase/database';
import './CustomerProfilePage.css';

const CustomerProfilePage = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      const customerId = localStorage.getItem('customerUserId');
      if (!customerId) {
        navigate('/');
        return;
      }

      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'customers'));
        
        if (snapshot.exists()) {
          const customers = snapshot.val();
          const customer = Object.values(customers).find(
            c => c.userId === customerId
          );
          
          if (customer) {
            setCustomerData(customer);
          }
        }
      } catch (error) {
        console.error('顧客データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate]);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="customer-profile-container">
      <h1 className="profile-title">お客様情報</h1>
      {customerData && (
        <div className="profile-content">
          <div className="profile-item">
            <label>お名前</label>
            <p>{customerData.name}</p>
          </div>
          <div className="profile-item">
            <label>ユーザーID</label>
            <p>{customerData.userId}</p>
          </div>
          <div className="profile-item">
            <label>メールアドレス</label>
            <p>{customerData.email}</p>
          </div>
          <div className="profile-item">
            <label>電話番号</label>
            <p>{customerData.phone}</p>
          </div>
        </div>
      )}
      <div className="button-container">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          カレンダーに戻る
        </button>
      </div>
    </div>
  );
};

export default CustomerProfilePage; 