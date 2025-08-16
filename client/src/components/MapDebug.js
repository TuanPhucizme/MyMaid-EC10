import React from 'react';

const MapDebug = () => {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    MAPBOX_TOKEN: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
    FIREBASE_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    API_URL: process.env.REACT_APP_API_URL
  };

  return (
    <div style={{ 
      padding: '1rem', 
      background: '#f3f4f6', 
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      margin: '1rem 0',
      fontFamily: 'monospace',
      fontSize: '0.875rem'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0' }}>🔍 Environment Variables Debug</h3>
      <div>
        <strong>NODE_ENV:</strong> {envVars.NODE_ENV || 'undefined'}
      </div>
      <div>
        <strong>MAPBOX_TOKEN:</strong> {envVars.MAPBOX_TOKEN ? `Đã có (${envVars.MAPBOX_TOKEN.length} ký tự)` : 'undefined'}
      </div>
      <div>
        <strong>FIREBASE_KEY:</strong> {envVars.FIREBASE_KEY ? 'Đã có' : 'undefined'}
      </div>
      <div>
        <strong>API_URL:</strong> {envVars.API_URL || 'undefined'}
      </div>
      
      {!envVars.MAPBOX_TOKEN && (
        <div style={{ 
          marginTop: '0.5rem', 
          padding: '0.5rem', 
          background: '#fef3c7', 
          border: '1px solid #f59e0b',
          borderRadius: '0.25rem',
          color: '#92400e'
        }}>
          ⚠️ REACT_APP_MAPBOX_ACCESS_TOKEN không được tìm thấy!
          <br />
          💡 Hãy restart development server để load lại .env file
        </div>
      )}
    </div>
  );
};

export default MapDebug;
