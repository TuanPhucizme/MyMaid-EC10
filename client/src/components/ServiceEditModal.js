// src/components/ServiceEditModal.js

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Save, PlusCircle, Trash2 } from 'lucide-react';
import ErrorMessage from './ErrorMessage';

// --- Styled Components for the Modal ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 1000px;
  position: relative;
`;

const ModalHeader = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  &:hover { color: #1a202c; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  min-height: 100px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TierSection = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const TierRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const AddTierButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background: #e5e7eb; }
`;

const RemoveTierButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  margin-top: 2rem; // Căn chỉnh với các ô input
  padding: 0.5rem;
  border-radius: 50%;
  &:hover { background: #fee2e2; }
`;

const schema = yup.object({
  id: yup.string().matches(/^[a-z0-9-]+$/, "ID chỉ được chứa chữ thường, số, và dấu gạch ngang").required("Service ID là bắt buộc"),
  name_service: yup.string().required("Tên dịch vụ là bắt buộc"),
  description: yup.string().required("Mô tả là bắt buộc"),
  pricingTiers: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required('Nhãn là bắt buộc'),
        price: yup.number().typeError("Giá phải là số").min(0).required('Giá là bắt buộc'),
        duration: yup.number().typeError("Thời gian phải là số").min(0).required('Thời gian là bắt buộc'),
      })
    )
    .min(1, "Phải có ít nhất một bậc giá."),
});

const ServiceEditModal = ({ service, onSave, onClose, isSaving }) => {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    // Thiết lập giá trị mặc định cho field array
    defaultValues: {
      name_service: '',
      description: '',
      pricingTiers: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricingTiers"
  });

  useEffect(() => {
    if (service) {
      // Chế độ sửa: điền dữ liệu, bao gồm cả mảng pricingTiers
      reset({
        name_service: service.name_service,
        description: service.description,
        pricingTiers: service.pricingTiers || [],
      });
    } else {
      // Chế độ thêm mới: reset về rỗng
      reset({
        name_service: '',
        description: '',
        pricingTiers: [{ label: '', price: '', duration: '' }], // Bắt đầu với 1 bậc giá trống
      });
    }
  }, [service, reset]);


  const handleFormSubmit = (data) => {
    const processedData = {
      ...data,
      pricingTiers: data.pricingTiers.map(tier => ({
        ...tier,
        id: tier.id || `tier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }))
    };
    onSave(processedData, service?.id);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><X size={24} /></CloseButton>
        <ModalHeader>
          <ModalTitle>{service ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</ModalTitle>
        </ModalHeader>
        
        {/* ✅ 3. CẬP NHẬT LẠI FORM */}
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {!service && ( // Chỉ hiển thị khi thêm mới (service is null)
            <FormGroup>
              <Label>Service ID (ví dụ: general-cleaning)</Label>
              <Input {...register('id')} />
              {errors.id && <ErrorMessage>{errors.id.message}</ErrorMessage>}
            </FormGroup>
          )}
          <FormGroup>
            <Label>Tên Dịch Vụ</Label>
            <Input {...register('name_service')} />
            {errors.name_service && <ErrorMessage>{errors.name_service.message}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label>Mô Tả</Label>
            <TextArea {...register('description')} />
            {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
          </FormGroup>

          <TierSection>
            <Label style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '1rem' }}>Các Bậc Giá</Label>
            {fields.map((field, index) => (
              <div key={field.id}>
                <TierRow>
                  <FormGroup>
                    <Label>Nhãn (e.g., Nhỏ, Vừa)</Label>
                    <Input {...register(`pricingTiers.${index}.label`)} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Giá (VNĐ)</Label>
                    <Input type="number" {...register(`pricingTiers.${index}.price`)} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Thời gian (giờ)</Label>
                    <Input type="number" step="0.5" {...register(`pricingTiers.${index}.duration`)} />
                  </FormGroup>
                  <RemoveTierButton type="button" onClick={() => remove(index)}>
                    <Trash2 size={16} />
                  </RemoveTierButton>
                </TierRow>
                {/* Hiển thị lỗi cho từng trường trong mảng */}
                {errors.pricingTiers?.[index] && (
                  <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {errors.pricingTiers[index].label?.message && <p>- {errors.pricingTiers[index].label.message}</p>}
                    {errors.pricingTiers[index].price?.message && <p>- {errors.pricingTiers[index].price.message}</p>}
                    {errors.pricingTiers[index].duration?.message && <p>- {errors.pricingTiers[index].duration.message}</p>}
                  </div>
                )}
              </div>
            ))}
            {errors.pricingTiers && !errors.pricingTiers.length && (
                <ErrorMessage>{errors.pricingTiers.message}</ErrorMessage>
            )}

            <AddTierButton 
              type="button" 
              onClick={() => append({ label: '', price: '', duration: '' })}
            >
              <PlusCircle size={16} /> Thêm Bậc Giá
            </AddTierButton>
          </TierSection>

          <FormActions>
            <Button type="button" onClick={onClose} style={{ background: '#e5e7eb' }}>Hủy</Button>
            <Button type="submit" disabled={isSaving} style={{ background: '#3b82f6', color: 'white' }}>
              <Save size={16} /> {isSaving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </FormActions>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ServiceEditModal;