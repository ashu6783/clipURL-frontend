import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const backendURL = import.meta.env.VITE_BACKEND_URL;


const ShortenForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const res = await axios.post(
        `${backendURL}/api/links/shorten`,
        { originalUrl, alias, expiresAt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShortUrl(res.data.shortUrl);
    } catch (error) {
      alert('Failed to shorten URL');
      console.error('Error shortening URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${backendURL}/${shortUrl}`);
    alert('Short URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col space-y-4 bg-gray-100 items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">Shorten a URL</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="url"
              placeholder="Enter long URL"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Custom alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white ${
              loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
            } transition`}
            disabled={loading}
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 text-center">
            <p className="text-gray-700 mb-2">
              Short URL:{' '}
              <a
                href={`${backendURL}/${shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                {`${backendURL}/${shortUrl}`}
              </a>
            </p>
            <button
              onClick={handleCopy}
              className="mb-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Copy to Clipboard
            </button>
            <div className="flex justify-center">
              <QRCode
                value={`${backendURL}/${shortUrl}`}
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>
            <span className='text-teal-700 p-1'>Scan the QR code to visit the shortened URL</span>
          </div>
        )}
      </div>
      <button className='px-4 py-2 space-y-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition' onClick={() => navigate('/dashboard')}>Move to Dashboard</button>
    </div>
  );
};

export default ShortenForm;
