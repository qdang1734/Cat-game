import React, { useState, useEffect } from 'react';

const TEXTS = {
  en: { stats: 'Latest Items', users: 'Users', box: 'Item', tonPerDay: 'TON/day' },
  vi: { stats: 'Vật phẩm gần đây', users: 'Người dùng', box: 'Vật phẩm', tonPerDay: 'TON/ngày' },
  zh: { stats: '最新物品', users: '用户', box: '物品', tonPerDay: 'TON/天' },
  ru: { stats: 'Последние предметы', users: 'Пользователи', box: 'Предмет', tonPerDay: 'TON/день' },
  ko: { stats: '최근 아이템', users: '사용자', box: '아이템', tonPerDay: 'TON/일' },
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// Helper function để lấy hình ảnh cat, có fallback khi không tìm thấy
const getCatImage = (catName) => {
  try {
    return require(`../assets/images/${catName}.png`);
  } catch (error) {
    console.warn(`Không tìm thấy ảnh cho cat: ${catName}`);
    return require('../assets/images/Fluffy.png'); // Fallback image
  }
};

const Stats = ({ selectedLang }) => {
  const lang = selectedLang?.code || 'en';
  const t = TEXTS[lang] || TEXTS.en;
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch danh sách 50 cat gần nhất từ API
  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/latest-cats`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.cats)) {
          // Thêm icon vào từng item từ local assets
          const catsWithIcons = data.cats.map(cat => ({
            ...cat,
            item: {
              ...cat.item,
              icon: getCatImage(cat.item.name)
            }
          }));
          setStatsData(catsWithIcons);
        } else {
          // Nếu không có dữ liệu hoặc API chưa sẵn sàng, sử dụng dữ liệu mẫu
          console.warn("Không lấy được dữ liệu từ API, sử dụng dữ liệu mẫu");
          // Fallback đến dữ liệu mẫu
          setStatsData([
            { name: 'User1', avatar: 'https://i.pravatar.cc/40?img=1', item: { name: 'Fluffy', icon: require('../assets/images/Fluffy.png'), earn: '0.0002' } },
            { name: 'User2', avatar: 'https://i.pravatar.cc/40?img=2', item: { name: 'Phantom', icon: require('../assets/images/Phantom.png'), earn: '0.1' } }
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching latest cats:', err);
        setError('Không thể kết nối với máy chủ. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 text-white min-h-screen bg-gradient-to-b from-purple-900 to-black pb-16">
      <h2 className="text-xl font-bold mb-4">{t.stats}</h2>
      {loading && (
        <div className="text-center p-4">
          <p className="text-purple-300">Đang tải dữ liệu...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center p-4 bg-red-900/50 rounded-xl">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      
      <div className="bg-purple-900 rounded-2xl shadow-lg p-2 max-w-md mx-auto">
        <div className="flex px-2 py-2 border-b border-purple-700 font-semibold text-sm text-gray-200">
          <div className="w-2/5">{t.users}</div>
          <div className="w-1/5 text-center">{t.box}</div>
          <div className="w-2/5 text-right">{t.tonPerDay}</div>
        </div>
        {!loading && statsData.length === 0 && (
          <div className="text-center p-4">
            <p className="text-purple-300 italic">Chưa có dữ liệu mở cat nào.</p>
          </div>
        )}
        
        {statsData.map((item, idx) => (
          <div key={idx} className="flex items-center px-2 py-2 border-b border-purple-800 last:border-b-0">
            <div className="w-2/5 flex items-center gap-2 truncate">
              <img src={item.avatar || require('../assets/images/Fluffy.png')} alt="avatar" className="w-7 h-7 rounded-full border-2 border-orange-300 bg-purple-950 object-cover" />
              <span className="truncate">{item.name}</span>
            </div>
            <div className="w-1/5 text-center">
              <img src={item.item.icon} alt={item.item.name} className="w-7 h-7 mx-auto" title={item.item.name} />
            </div>
            <div className="w-2/5 text-right font-bold text-orange-400">+{item.item.earn} TON</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
