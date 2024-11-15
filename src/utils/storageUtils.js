// ユーザー情報の取得
export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : {};
};

// ユーザー情報の保存
export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// 予約情報の取得
export const getBookings = () => {
  const bookings = localStorage.getItem('bookings');
  return bookings ? JSON.parse(bookings) : {};
};

// 予約情報の保存
export const saveBookings = (bookings) => {
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

// ログインセッションの設定
export const setLoginSession = (username) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', username);
};

// ログイン状態のチェック
export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// 現在のユーザーを取得
export const getCurrentUser = () => {
  return localStorage.getItem('currentUser');
};

// ログアウト処理
export const logout = () => {
  // ログイン関連の情報のみを削除
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userType');
  
  // 以下の情報は削除しない
  // - bookings（予約情報）
  // - users（ユーザー情報）
  // - savedUsername（保存されたユーザー名）
  // - savedPassword（保存されたパスワード）
};