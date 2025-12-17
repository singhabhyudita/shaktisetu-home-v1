import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './AckPage.css';

const AckPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const acknowledgeToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing token parameter. Please provide token=xxxxx in the query string.');
        return;
      }

      try {
        // Call the Supabase edge function: acknowledge-sms-notification
        // The edge function expects token as query parameter, so we call it via HTTP
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase configuration');
        }

        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/acknowledge-sms-notification?token=${encodeURIComponent(token)}`;
        
        const response = await fetch(edgeFunctionUrl, {
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
        });

        const responseText = await response.text();
        
        // Debug logging
        console.log('Response status:', response.status);
        console.log('Response content-type:', response.headers.get('content-type'));
        console.log('Response text preview:', responseText.substring(0, 100));
        
        // Check HTTP status code first - 200 means success
        if (response.ok && response.status === 200) {
          // Check if response is HTML (success case) or JSON (error case)
          const contentType = response.headers.get('content-type') || '';
          const isHtml = contentType.toLowerCase().includes('text/html') || 
                        responseText.trim().toLowerCase().startsWith('<!doctype') ||
                        responseText.trim().toLowerCase().startsWith('<html');
          
          if (isHtml) {
            setStatus('success');
            setMessage('Notification acknowledged successfully!');
          } else {
            // Try to parse as JSON for error messages
            try {
              const jsonResponse = JSON.parse(responseText);
              setStatus('error');
              setMessage(jsonResponse.error || 'Failed to acknowledge token');
            } catch (e) {
              // If it's not JSON and not HTML, but status is 200, treat as success
              setStatus('success');
              setMessage('Notification acknowledged successfully!');
            }
          }
        } else {
          // Non-200 status code - parse JSON error response
          try {
            const jsonResponse = JSON.parse(responseText);
            setStatus('error');
            setMessage(jsonResponse.error || `Failed to acknowledge token (Status: ${response.status})`);
          } catch (e) {
            setStatus('error');
            setMessage(`Failed to acknowledge token (Status: ${response.status})`);
          }
        }
      } catch (error) {
        console.error('Error calling acknowledge edge function:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to acknowledge token');
      }
    };

    acknowledgeToken();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="ack-page">
        <div className="container">
          <div className="spinner"></div>
          <p>Processing acknowledgement...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="ack-page">
        <div className="container">
          <div className="checkmark">✓</div>
          <h1>Thank You!</h1>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ack-page">
      <div className="container error">
        <div className="error-icon">✗</div>
        <h1>Error</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AckPage;

