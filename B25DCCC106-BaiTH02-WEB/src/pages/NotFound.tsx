import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h2 className="not-found-title">Không tìm thấy trang</h2>
        <p className="not-found-desc">
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã bị thay đổi.
        </p>
        <Link to="/" className="action-btn">
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

