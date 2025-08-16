import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

// Import Components
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Import Firebase
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// --- Styled Components ---
const ReviewContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8fafc;
`;

const ReviewCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1a202c;
`;

const BookingSummary = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ServiceName = styled.p`
  font-weight: 600;
  color: #1a202c;
`;

const ServiceDate = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Form = styled.form``;

const RatingSection = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const RatingLabel = styled.p`
  font-weight: 500;
  color: #374151;
  margin-bottom: 1rem;
`;

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  resize: vertical;
  margin-bottom: 1.5rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #3b82f6;
  color: white;
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const LeaveReviewPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy thông tin cơ bản của đơn hàng để hiển thị
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("Mã đơn hàng không hợp lệ.");
        setIsLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "bookings", bookingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBooking({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Không tìm thấy đơn hàng này.");
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá.");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          bookingId: booking.id,
          partnerId: booking.partnerId,
          rating,
          comment,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      toast.success('Cảm ơn bạn đã gửi đánh giá!');
      navigate('/'); // Chuyển về trang chủ sau khi review thành công
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải trang đánh giá..." />;
  }

  if (error) {
    return <ReviewContainer><ErrorMessage message={error} /></ReviewContainer>;
  }

  return (
    <ReviewContainer>
      <ReviewCard>
        <Header>
          <Title>Đánh giá dịch vụ</Title>
        </Header>
        
        <BookingSummary>
          <ServiceName>{booking?.service?.name}</ServiceName>
          <ServiceDate>
            Hoàn thành ngày: {new Date(booking?.schedule?.date).toLocaleDateString('vi-VN')}
          </ServiceDate>
        </BookingSummary>

        <Form onSubmit={handleSubmit}>
          <RatingSection>
            <RatingLabel>Chất lượng dịch vụ thế nào?</RatingLabel>
            <StarContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={40}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', color: (hoverRating || rating) >= star ? '#facc15' : '#e5e7eb', transition: 'color 0.2s' }}
                />
              ))}
            </StarContainer>
          </RatingSection>
          
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ cảm nhận của bạn về đối tác và dịch vụ (không bắt buộc)..."
          />
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            <Send size={16} />
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </SubmitButton>
        </Form>
      </ReviewCard>
    </ReviewContainer>
  );
};

export default LeaveReviewPage;