import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';

const FirebaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const getDebugInfo = () => {
      try {
        const info = {
          authExists: !!auth,
          appExists: !!auth?.app,
          config: auth?.app?.options || {},
          currentUser: auth?.currentUser,
          authDomain: auth?.app?.options?.authDomain,
          projectId: auth?.app?.options?.projectId,
          apiKey: auth?.app?.options?.apiKey ? '***' + auth.app.options.apiKey.slice(-4) : 'Not found',
          firestoreExists: !!db,
          firestoreApp: db?.app?.name || 'Not found'
        };
        setDebugInfo(info);
      } catch (error) {
        setDebugInfo({ error: error.message });
      }
    };

    getDebugInfo();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Firebase Debug Info:</h4>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
};

export default FirebaseDebug;
