import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { database } from '../../yoyakujoho';
import { ref, onValue } from 'firebase/database';
import { TIME_SLOTS, WEEK_DAYS } from '../../constants/config';
import { isPastTime } from '../../utils/dateUtils';
import { isLoggedIn } from '../../utils/storageUtils';
import './Calendar.css';

const Calendar = () => {
  const [dates, setDates] = useState([]);
  const [bookings, setBookings] = useState({});
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate();

  const generateDateKey = (date, hours, minutes) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(hours).padStart(2, '0')}-${String(minutes).padStart(2, '0')}`;
  };

  useEffect(() => {
    const today = new Date();
    const nextDates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextDates.push(date);
    }
    setDates(nextDates);

    const bookingsRef = ref(database, 'bookings');
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const bookingsData = snapshot.val();
        const formattedBookings = {};
        
        Object.values(bookingsData).forEach(booking => {
          const bookingDate = new Date(booking.date);
          const dateKey = generateDateKey(
            bookingDate,
            bookingDate.getHours(),
            bookingDate.getMinutes()
          );
          formattedBookings[dateKey] = booking;
        });
        
        setBookings(formattedBookings);
      }
    });

    const customerLoggedIn = localStorage.getItem('customerLoggedIn') === 'true';
    const name = localStorage.getItem('customerName');
    setIsCustomerLoggedIn(customerLoggedIn);
    setCustomerName(name || '');

    return () => unsubscribe();
  }, []);

  const handleCustomerLogin = () => {
    navigate('/customer-login');
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('customerLoggedIn');
    localStorage.removeItem('customerUserId');
    localStorage.removeItem('customerName');
    setIsCustomerLoggedIn(false);
    setCustomerName('');
    navigate('/');
  };

  const handleViewBookings = () => {
    if (isLoggedIn()) {
      navigate('/bookings');
    } else {
      navigate('/login');
    }
  };

  const handleSlotClick = (date, time) => {
    navigate(`/booking-form?year=${date.getFullYear()}&month=${date.getMonth()}&day=${date.getDate()}&hours=${date.getHours()}&minutes=${date.getMinutes()}`);
  };

  return (
    <div className="calendar-page">
      <div className="header-container">
        <h1 className="calendar-title">予約カレンダー</h1>
        <div className="customer-auth-area">
          {isCustomerLoggedIn ? (
            <>
              <Link to="/customer-profile" className="customer-name-link">
                <span className="customer-name">{customerName}様</span>
              </Link>
              <button 
                onClick={handleCustomerLogout}
                className="logout-button"
              >
                ログアウト
              </button>
            </>
          ) : (
            <button 
              onClick={handleCustomerLogin}
              className="login-button"
            >
              お客様ログイン
            </button>
          )}
        </div>
      </div>

      <div className="calendar-container">
        <table className="calendar">
          <thead>
            <tr>
              <th className="empty-header"></th>
              {dates.map((date, i) => {
                const dayOfWeek = date.getDay();
                const dayClass = dayOfWeek === 0 ? 'sunday' : 
                               dayOfWeek === 6 ? 'saturday' : '';
                return (
                  <th key={i} className={`date-header ${dayClass}`}>
                    <div className="date-number">
                      {date.getDate()}日
                    </div>
                    <div className="weekday">{WEEK_DAYS[dayOfWeek]}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time}>
                <td className="time-slot">{time}</td>
                {dates.map((date, i) => {
                  const dayOfWeek = date.getDay();
                  const dayClass = dayOfWeek === 0 ? 'sunday' : 
                                 dayOfWeek === 6 ? 'saturday' : '';
                  
                  const [hours, minutes] = time.split(':').map(Number);
                  const dateKey = generateDateKey(date, hours, minutes);
                  
                  const isBooked = bookings[dateKey];
                  const isPast = isPastTime(date, time);

                  const slotDate = new Date(date);
                  slotDate.setHours(hours, minutes);

                  return (
                    <td 
                      key={i}
                      className={`slot ${isBooked ? 'booked' : ''} ${isPast ? 'past' : ''} ${dayClass}`}
                      onClick={() => !isBooked && !isPast && handleSlotClick(slotDate, time)}
                    >
                      {isPast ? (
                        <span className="past-mark">-</span>
                      ) : (
                        <>
                          {!isBooked && <span className="available-mark">◎</span>}
                          {isBooked && <span className="booked-mark">予約済</span>}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        className="login-button"
        onClick={handleViewBookings}
      >
        オーナー専用
      </button>
    </div>
  );
};

export default Calendar;