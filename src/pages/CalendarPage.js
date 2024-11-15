const CalendarPage = () => {
    const navigate = useNavigate();
    const { bookings } = useBookings();
  
    return (
      <div className="calendar-page">
        <h1 className="page-title">予約カレンダー</h1>
        <div className="calendar-wrapper">
          <Calendar bookings={bookings} onSelectDate={handleSelectDate} />
        </div>
      </div>
    );
  };