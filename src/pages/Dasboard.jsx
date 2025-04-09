import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearToken } from '../redux/authSlice';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedCharts, setExpandedCharts] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [hasMorePages, setHasMorePages] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchLinks = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/links/analytics', {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, page, limit: itemsPerPage },
        });
        
        setLinks(res.data);
        setHasMorePages(res.data.length === itemsPerPage);
      } catch (err) {
        console.error('Error fetching links:', err);
        alert('Failed to fetch links. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [search, page, itemsPerPage, navigate]);

  const getChartData = (clicks) => {
    const data = {};
    clicks.forEach((click) => {
      const date = new Date(click.timestamp).toLocaleDateString();
      data[date] = (data[date] || 0) + 1;
    });
    return Object.entries(data).map(([date, count]) => ({ date, count }));
  };

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  const toggleChart = (linkId) => {
    setExpandedCharts(prev => ({
      ...prev,
      [linkId]: !prev[linkId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-teal-800">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-red-400 transition"
        >
          Logout
        </button>
      </div>

      {/* Search Bar and Items Per Page */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by URL..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none  focus:ring-2 focus:ring-teal-500"
        />
        <div className="flex items-center">
          <label htmlFor="itemsPerPage" className="mr-2 text-white">URLs per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-teal-500 rounded-full mb-4"></div>
          <p>Loading...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-teal-600">
          No links found. Try a different search term or create some short links first.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left text-teal-700 font-semibold">Original URL</th>
                  <th className="p-3 text-left text-teal-700 font-semibold">Short URL</th>
                  <th className="p-3 text-left text-teal-700 font-semibold">Clicks</th>
                  <th className="p-3 text-left text-teal-700 font-semibold">Created</th>
                  <th className="p-3 text-left text-teal-700 font-semibold">Expires</th>
                  <th className="p-3 text-left text-teal-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link._id} className="hover:bg-teal-50 transition">
                    <td className="p-3 border-t text-gray-800 truncate max-w-xs">
                      {link.originalUrl}
                    </td>
                    <td className="p-3 border-t text-teal-600">
                      <a
                        href={`http://localhost:5000/${link.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.shortUrl}
                      </a>
                    </td>
                    <td className="p-3 border-t text-teal-800">{link.clicks.length}</td>
                    <td className="p-3 border-t text-teal-800">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 border-t text-teal-800">
                      {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-3 border-t">
                      <button
                        onClick={() => toggleChart(link._id)}
                        className={`px-3 py-1 rounded text-white ${
                          expandedCharts[link._id] ? 'bg-teal-700 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'
                        } transition`}
                      >
                        {expandedCharts[link._id] ? 'Close Chart' : 'View Chart'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts Section opens when open chart button is clicked */}
          {links.map((link) => (
            expandedCharts[link._id] && (
              <div key={`chart-${link._id}`} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {link.shortUrl} - Clicks Over Time
                </h3>
                {link.clicks.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData(link.clicks)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="date"
                        stroke="#666"
                        tick={{ fill: '#666', fontSize: 12 }}
                      />
                      <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}
                        labelStyle={{ color: '#333' }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Clicks"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#4f46e5' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center p-10 text-teal-500">
                    No clicks recorded for this link yet.
                  </div>
                )}
              </div>
            )
          ))}

          {/* Pagination */}
          <div className="bg-teal p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                Page {page}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-teal-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!hasMorePages}
                  className="px-4 py-2 bg-teal-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;