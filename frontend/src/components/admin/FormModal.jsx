import React, { useState, useRef } from 'react';
import './FormModal.css';

const FormModal = ({ 
  title, 
  fields = [], 
  initialData = {}, 
  onSubmit, 
  onClose, 
  loading = false,
  onFormDataChange
}) => {
  const [formData, setFormData] = useState(() => {
    const data = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        data[field.name] = (initialData && initialData[field.name]) || false;
      } else if (field.type === 'file') {
        data[field.name] = (initialData && initialData[field.name]) || null;
      } else {
        data[field.name] = (initialData && initialData[field.name]) || '';
      }
    });
    return data;
  });

  const [errors, setErrors] = useState({});
  const fileInputRefs = useRef({});

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            [name]: {
              file: file,
              url: e.target.result,
              name: file.name,
              size: file.size,
              type: file.type
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Call onFormDataChange if provided
    if (onFormDataChange) {
      const newData = { ...formData, [name]: type === 'checkbox' ? checked : value };
      onFormDataChange(newData);
    }
  };

  const removeFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const removeFileFromArray = (fieldName, index) => {
    setFormData(prev => {
      const currentFiles = prev[fieldName];
      if (Array.isArray(currentFiles)) {
        const updatedFiles = currentFiles.filter((_, i) => i !== index);
        return {
          ...prev,
          [fieldName]: updatedFiles.length > 0 ? updatedFiles : null
        };
      }
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.name] && !/\S+@\S+\.\S+/.test(formData[field.name])) {
        newErrors[field.name] = 'Please enter a valid email address';
      }
      
      if (field.type === 'url' && formData[field.name] && !/^https?:\/\/.+/.test(formData[field.name])) {
        newErrors[field.name] = 'Please enter a valid URL';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('FormModal - Form submitted');
    console.log('FormModal - Form data:', formData);
    console.log('FormModal - Fields:', fields);
    
    if (validateForm()) {
      console.log('FormModal - Validation passed, calling onSubmit');
      onSubmit(formData);
    } else {
      console.log('FormModal - Validation failed');
    }
  };

  const renderField = (field) => {
    if (!field || !field.name) return null;
    
    const fieldValue = formData[field.name];
    const fieldError = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'number':
        return (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className={fieldError ? 'error' : ''}
            />
            {fieldError && <span className="error-text">{fieldError}</span>}
          </div>
        );

      case 'textarea':
        return (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              className={fieldError ? 'error' : ''}
            />
            {fieldError && <span className="error-text">{fieldError}</span>}
          </div>
        );

      case 'select':
        return (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              className={fieldError ? 'error' : ''}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && <span className="error-text">{fieldError}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div className="form-group checkbox-group" key={field.name}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name={field.name}
                checked={fieldValue}
                onChange={handleInputChange}
              />
              <span className="checkbox-text">{field.label}</span>
            </label>
          </div>
        );

      case 'file':
        return (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="file-upload-container">
              <input
                type="file"
                id={field.name}
                name={field.name}
                accept={field.accept}
                multiple={field.multiple}
                onChange={handleInputChange}
                ref={el => fileInputRefs.current[field.name] = el}
                className="file-input"
              />
              <button
                type="button"
                onClick={() => fileInputRefs.current[field.name]?.click()}
                className="file-upload-btn"
              >
                <i className="fas fa-upload"></i>
                {field.multiple ? 'Upload Files' : 'Upload File'}
              </button>
              {fieldValue && (
                <div className="file-preview">
                  {fieldValue.url && field.accept?.includes('image') ? (
                    <img src={fieldValue.url} alt="Preview" className="file-thumbnail" />
                  ) : (
                    <i className="fas fa-file file-icon"></i>
                  )}
                  <div className="file-details">
                    <span className="file-name">{fieldValue.name}</span>
                    <span className="file-size">{formatFileSize(fieldValue.size)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(field.name)}
                    className="remove-file-btn"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
            {fieldError && <span className="error-text">{fieldError}</span>}
          </div>
        );

      case 'custom':
        return (
          <div className="form-group" key={field.name}>
            {field.component && field.component({
              value: fieldValue,
              onChange: (value) => handleInputChange({ target: { name: field.name, value } }),
              error: fieldError,
              ...field.props
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="form-modal">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-fields">
          {fields && fields.length > 0 ? fields.map(renderField) : (
            <div className="no-fields-message">
              <p>No form fields configured</p>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormModal;