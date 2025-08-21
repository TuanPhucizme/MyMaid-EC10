// src/components/ReviewDetailModal.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Star, Package } from 'lucide-react';
import { auth } from '../config/firebase';
import LoadingSpinner from './LoadingSpinner';

// --- Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const StarRating = styled.div` display: flex; gap: 0.25rem; color: #facc15; margin-bottom: 1rem; `;
const Comment = styled.p` background: #f9fafb; border: 1px solid #e5e7eb; padding: 1rem; border-radius: 0.5rem; color: #374151; line-height: 1.6; `;
const ReviewDate = styled.p` font-size: 0.875rem; color: #6b7280; text-align: right; margin-top: 1rem; `;

const ReviewDetailModal = ({ bookingId, isOpen, onClose }) => {
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && bookingId) {
      const fetchReview = async () => {
        setIsLoading(true);
        try {
          const token = await auth.currentUser.getIdToken();
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews/by-booking/${bookingId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Không thể tải đánh giá.');
          const data = await response.json();
          setReview(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReview();
    }
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><X size={24} /></CloseButton>
        <ModalHeader><ModalTitle>Đánh giá của bạn</ModalTitle>

        </ModalHeader>
        <div style={{ padding: '1.5rem' }}>
          {isLoading ? <LoadingSpinner /> : review ? (
            <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                    <Package size={16} />
                    <span style={{ fontWeight: 500 }}>{review.serviceName}</span>
                </div>

              <StarRating>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} fill={i < review.rating ? '#facc15' : 'none'} />
                ))}
              </StarRating>
              <Comment>{review.comment || 'Bạn không để lại bình luận.'}</Comment>
              <ReviewDate>
                Đã đánh giá ngày: {review.createdAt 
                ? new Date(review.createdAt).toLocaleDateString('vi-VN') 
                : 'Không rõ'}
              </ReviewDate>
            </>
          ) : <p>Không tìm thấy dữ liệu đánh giá.</p>}
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReviewDetailModal;