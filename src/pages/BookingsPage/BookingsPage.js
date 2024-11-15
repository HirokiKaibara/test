import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../yoyakujoho';  // Firebaseの設定をインポート
import { ref, onValue, set } from 'firebase/database';
import { isLoggedIn, logout } from '../../utils/storageUtils';
import './BookingsPage.css';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Firebaseから予約情報を取得
    const bookingsRef = ref(database, 'bookings');
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const bookingsData = snapshot.val();
        // 予約データを配列に変換
        const bookingsArray = Object.entries(bookingsData).map(([key, booking]) => ({
          ...booking,
          id: key  // Firebase上のキーを保存
        }));

        // 日付順にソート
        bookingsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
        setBookings(bookingsArray);
      } else {
        setBookings([]);
      }
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, [navigate]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('この予約を削除してもよろしいですか？')) {
      try {
        // Firebaseから予約を削除
        const bookingRef = ref(database, `bookings/${bookingId}`);
        await set(bookingRef, null);
        // 削除は自動的にリスナーによって検知され、UIが更新されます
      } catch (error) {
        console.error('予約の削除に失敗しました:', error);
        alert('予約の削除中にエラーが発生しました。');
      }
    }
  };

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <div className="header-container">
          <h1>予約一覧</h1>
        </div>

        {bookings.length === 0 ? (
          <p className="no-bookings">予約はありません。</p>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-date">
                    <span className="label">予約日時:</span>
                    {formatDateTime(booking.date)}
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteBooking(booking.id)}
                    title="この予約を削除"
                  >
                    ×
                  </button>
                </div>
                <div className="booking-info">
                  <div className="info-row">
                    <span className="label">お名前:</span>
                    {booking.name}
                  </div>
                  <div className="info-row">
                    <span className="label">電話番号:</span>
                    {booking.phone}
                  </div>
                  <div className="info-row">
                    <span className="label">メールアドレス:</span>
                    {booking.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="button-container">
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            ログアウト
          </button>
          
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            カレンダーに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;