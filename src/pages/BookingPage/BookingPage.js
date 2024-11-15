import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings, isLoggedIn, saveBookings } from '../../utils/storageUtils';
import './BookingsPage.css';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const allBookings = getBookings() || {};
    const bookingsArray = Object.entries(allBookings).map(([key, booking]) => ({
      ...booking,
      dateKey: key
    }));

    bookingsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    setBookings(bookingsArray);
  }, [navigate]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    setBookings([]);
    navigate('/login', { replace: true });
  };

  // 予約削除処理を追加
  const handleDeleteBooking = (dateKey) => {
    if (window.confirm('この予約を削除してもよろしいですか？')) {
      // 現在の予約情報を取得
      const currentBookings = getBookings() || {};
      
      // 指定された予約を削除
      delete currentBookings[dateKey];
      
      // 更新された予約情報を保存
      saveBookings(currentBookings);
      
      // 画面の表示を更新
      const updatedBookingsArray = Object.entries(currentBookings).map(([key, booking]) => ({
        ...booking,
        dateKey: key
      }));
      updatedBookingsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
      setBookings(updatedBookingsArray);
    }
  };

  return (
    <div className="bookings-page">
      <div className="button-group">
        <button 
          className="header-button register-button"
          onClick={() => navigate('/RegisterPage')}
        >
          新規登録
        </button>
        <button 
          className="header-button password-button"
          onClick={() => navigate('/change-password')}
        >
          パスワード変更
        </button>
        <button 
          className="header-button logout-button"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </div>
      
      <div className="main-content">
        <h1 className="page-title">予約一覧</h1>
        {bookings.length === 0 ? (
          <p className="no-bookings">予約情報がありません</p>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, index) => (
              <div key={index} className="booking-card">
                <div className="booking-content">
                  <div className="booking-datetime">
                    <span className="label">予約日時:</span>
                    {formatDateTime(booking.date)}
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
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteBooking(booking.dateKey)}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        カレンダーに戻る
      </button>
    </div>
  );
};

export default BookingsPage;