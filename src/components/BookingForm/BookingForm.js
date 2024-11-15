import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { database } from '../../okyakujoho';
import { ref, get, child, push, set } from 'firebase/database';
import { getBookings } from '../../utils/storageUtils';
import { createDateKey } from '../../utils/dateUtils';
import './BookingForm.css';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCustomerData = async () => {
      const customerId = localStorage.getItem('customerUserId');
      const customerLoggedIn = localStorage.getItem('customerLoggedIn') === 'true';
      setIsLoggedIn(customerLoggedIn);

      if (customerId && customerLoggedIn) {
        try {
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, 'customers'));
          
          if (snapshot.exists()) {
            const customers = snapshot.val();
            const customer = Object.values(customers).find(
              c => c.userId === customerId
            );
            
            if (customer) {
              setFormData({
                name: customer.name || '',
                email: customer.email || '',
                phone: customer.phone || '',
              });
            }
          }
        } catch (error) {
          console.error('顧客データの取得に失敗しました:', error);
        }
      }
      setLoading(false);
    };

    fetchCustomerData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchParams = new URLSearchParams(location.search);
  const year = parseInt(searchParams.get('year'));
  const month = parseInt(searchParams.get('month'));
  const day = parseInt(searchParams.get('day'));
  const hours = parseInt(searchParams.get('hours'));
  const minutes = parseInt(searchParams.get('minutes'));

  const selectedDate = new Date(year, month, day, hours, minutes);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateKey = createDateKey(selectedDate);
    
    try {
      // 予約重複チェック（Firebaseから直接チェック）
      const bookingsRef = ref(database, 'bookings');
      const snapshot = await get(bookingsRef);
      const existingBookings = snapshot.val() || {};
      
      // dateKeyで重複をチェック
      const isSlotBooked = Object.values(existingBookings).some(
        booking => booking.dateKey === dateKey
      );

      if (isSlotBooked) {
        alert('申し訳ありません。この時間帯は既に予約されています。');
        navigate('/');
        return;
      }

      // 新しい予約データを作成
      const bookingData = {
        ...formData,
        date: selectedDate.toISOString(),
        userId: localStorage.getItem('customerUserId') || 'guest',
        dateKey: dateKey,
        year: year,
        month: month + 1,
        day: day,
        hours: hours,
        minutes: minutes,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      };

      // Firebaseに保存
      const newBookingRef = push(ref(database, 'bookings'));
      await set(newBookingRef, bookingData);

      // ローカルストレージの更新（必要な場合）
      const localBookings = getBookings() || {};
      localBookings[dateKey] = bookingData;
      localStorage.setItem('bookings', JSON.stringify(localBookings));

      alert('予約が完了しました。');
      navigate('/');
    } catch (error) {
      console.error('予約の保存に失敗しました:', error);
      alert('予約の保存中にエラーが発生しました。もう一度お試しください。');
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="booking-form-container">
      <h2>予約フォーム</h2>
      <div className="selected-datetime">
        予約日時: {year}年
        {month + 1}月
        {day}日
        {String(hours).padStart(2, '0')}:
        {String(minutes).padStart(2, '0')}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>お名前</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            readOnly={isLoggedIn}
            required
          />
        </div>

        <div className="form-group">
          <label>メールアドレス</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly={isLoggedIn}
            required
          />
        </div>

        <div className="form-group">
          <label>電話番号</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            readOnly={isLoggedIn}
            required
          />
        </div>

        {!isLoggedIn && (
          <div className="guest-notice">
            <p>※会員登録をすると、次回から情報の入力が不要になります。</p>
            <button
              type="button"
              className="register-link-button"
              onClick={() => navigate('/customer-register')}
            >
              会員登録はこちら
            </button>
          </div>
        )}

        <div className="button-group">
          <button type="submit" className="submit-button">
            予約を確定する
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
  );
};

export default BookingForm;