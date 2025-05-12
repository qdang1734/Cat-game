import React, { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import EggRewardModal from './EggRewardModal';
import { eggImages } from '../assets/eggs';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const eggs = [
  {
    price: 0.1,
    name: 'Mini Egg',
    earn: '0.0001 – 0.1 TON',
    img: eggImages[0],
    cats: [
      { name: 'Eclipse', rarity: 'Mythic', rate: '0.1%', earn: '2.0 TON' },
      { name: 'Fluffy', rarity: 'Common', rate: '39.9%', earn: '0.0002 TON' },
      { name: 'Meowster', rarity: 'Common', rate: '35%', earn: '0.0005 TON' },
      { name: 'Stripey', rarity: 'Rare', rate: '15%', earn: '0.0035 TON' },
      { name: 'Luna', rarity: 'Epic', rate: '7%', earn: '0.01 TON' },
      { name: 'Glitch', rarity: 'Epic', rate: '2%', earn: '0.02 TON' },
      { name: 'Phantom', rarity: 'Legendary', rate: '1%', earn: '0.1 TON' },
    ],
  },
  {
    price: 1,
    name: 'Starter Egg',
    earn: '0.001 – 0.5 TON',
    img: eggImages[1],
    cats: [
      { name: 'Tofu', rarity: 'Common', rate: '35%', earn: '0.002 TON' },
      { name: 'Boba', rarity: 'Common', rate: '30%', earn: '0.005 TON' },
      { name: 'Ash', rarity: 'Rare', rate: '15%', earn: '0.035 TON' },
      { name: 'Miso', rarity: 'Epic', rate: '10%', earn: '0.1 TON' },
      { name: 'Orion', rarity: 'Epic', rate: '5%', earn: '0.2 TON' },
      { name: 'Phantom', rarity: 'Legendary', rate: '3%', earn: '0.1 TON' },
      { name: 'Crystal', rarity: 'Legendary', rate: '2%', earn: '0.35 TON' },
    ],
  },
  {
    price: 10,
    name: 'Pro Egg',
    earn: '0.01 – 5 TON',
    img: eggImages[2],
    cats: [
      { name: 'Biscuit', rarity: 'Common', rate: '30%', earn: '0.01 TON' },
      { name: 'Mochi', rarity: 'Common', rate: '25%', earn: '0.05 TON' },
      { name: 'Onyx', rarity: 'Rare', rate: '20%', earn: '0.1 TON' },
      { name: 'Salem', rarity: 'Rare', rate: '15%', earn: '0.5 TON' },
      { name: 'Vega', rarity: 'Epic', rate: '5%', earn: '1.0 TON' },
      { name: 'Ghost', rarity: 'Epic', rate: '3%', earn: '1.2 TON' },
      { name: 'Solar', rarity: 'Legendary', rate: '1.5%', earn: '2.0 TON' },
      { name: 'Eclipse', rarity: 'Mythic', rate: '0.2%', earn: '5.0 TON' },
    ],
  },
  {
    price: 100,
    name: 'Genesis Egg',
    earn: '1.0 – 10 TON',
    img: eggImages[3],
    cats: [
      { name: 'Nebula', rarity: 'Common', rate: '30%', earn: '1.0 TON' },
      { name: 'Jade', rarity: 'Common', rate: '25%', earn: '2.0 TON' },
      { name: 'Blaze', rarity: 'Rare', rate: '20%', earn: '3.5 TON' },
      { name: 'Aqua', rarity: 'Rare', rate: '15%', earn: '4.0 TON' },
      { name: 'Storm', rarity: 'Epic', rate: '5%', earn: '5.0 TON' },
      { name: 'Nova', rarity: 'Epic', rate: '3%', earn: '5.5 TON' },
      { name: 'Dragon', rarity: 'Legendary', rate: '1.5%', earn: '6.0 TON' },
      { name: 'Chronos', rarity: 'Mythic', rate: '0.5%', earn: '10.0 TON' },
    ],
  },
];

const languages = [
  {
    code: 'en',
    label: 'English',
    flag: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg',
  },
  {
    code: 'ru',
    label: 'русский',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg',
  },
  {
    code: 'zh',
    label: '简体中文',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_China.svg',
  },
  {
    code: 'ko',
    label: '한국어',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg',
  },
  {
    code: 'vi',
    label: 'Tiếng Việt',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg',
  },
];

const TEXTS = {
  en: {
    collection: 'Collection',
    noCats: 'No cats yet. Open eggs to collect!',
    dailyReward: 'Daily Reward',
    totalReward: 'Total Reward',
    openEgg: 'Open Egg',
    gotCat: 'You got:',
    rarity: 'Rarity',
    earn: 'Earn',
  },
  vi: {
    collection: 'Bộ sưu tập',
    noCats: 'Chưa có mèo nào. Hãy mở trứng để sưu tập!',
    dailyReward: 'Thưởng mỗi ngày',
    totalReward: 'Tổng thưởng',
    openEgg: 'Mở trứng',
    gotCat: 'Bạn nhận được:',
    rarity: 'Độ hiếm',
    earn: 'Nhận',
  },
  zh: {
    collection: '收藏',
    noCats: '还没有猫咪，快开蛋收集吧！',
    dailyReward: '每日奖励',
    totalReward: '总奖励',
    openEgg: '开蛋',
    gotCat: '你获得了：',
    rarity: '稀有度',
    earn: '收益',
  },
  ru: {
    collection: 'Коллекция',
    noCats: 'Нет котов. Откройте яйца, чтобы собрать!',
    dailyReward: 'Ежедневная награда',
    totalReward: 'Общая награда',
    openEgg: 'Открыть яйцо',
    gotCat: 'Вы получили:',
    rarity: 'Редкость',
    earn: 'Доход',
  },
  ko: {
    collection: '컬렉션',
    noCats: '아직 고양이가 없습니다. 알을 열어보세요!',
    dailyReward: '일일 보상',
    totalReward: '총 보상',
    openEgg: '알 열기',
    gotCat: '획득:',
    rarity: '희귀도',
    earn: '수익',
  },
};

const Home = ({ selectedLang, setSelectedLang }) => {
  const userAddress = useTonAddress();
  const [gameBalance, setGameBalance] = useState(0);
  const [totalDailyReward, setTotalDailyReward] = useState(0);

  // Lấy tổng số TON Daily Reward đã nhận
  const refreshTotalDailyReward = () => {
    if (!userAddress) return;
    fetch(`${BACKEND_URL}/api/daily-reward/total/${userAddress}`)
      .then(res => res.json())
      .then(data => setTotalDailyReward(data.total || 0));
  };

  const refreshGameBalance = () => {
    if (!userAddress) return;
    fetch(`${BACKEND_URL}/api/balance/${userAddress}`)
      .then(res => res.json())
      .then(data => setGameBalance(data.balance || 0));
  };

  useEffect(() => {
    refreshGameBalance();
    refreshTotalDailyReward();
  }, [userAddress]);

  const [eggIdx, setEggIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [collection, setCollection] = useState([]);
  const [openedCat, setOpenedCat] = useState(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const texts = TEXTS[selectedLang.code] || TEXTS.en;
  const egg = eggs[eggIdx];
  const handlePrev = () => setEggIdx(idx => (idx - 1 + eggs.length) % eggs.length);
  const handleNext = () => setEggIdx(idx => (idx + 1) % eggs.length);

  // Hiển thị tổng Daily Reward
  const showTotalDailyReward = userAddress && (
    <div className="mb-2 flex justify-center">
      <div className="bg-purple-900/90 rounded-xl px-5 py-2 text-orange-300 font-bold shadow-lg text-base border border-orange-400 w-full text-center">
        Tổng TON nhận từ Daily Reward: <span className="text-orange-400">{totalDailyReward}</span> <img alt="TON" className="inline w-5 h-5 align-text-bottom ml-1" src="/static/media/ton.deffdd19de2e38e70e86.png" />
      </div>
    </div>
  );

  // Hiển thị số dư game
  const showGameBalance = userAddress && (
    <div className="mb-4 flex justify-center">
      <div className="bg-purple-900 rounded-xl px-6 py-2 text-orange-300 font-bold shadow-lg text-lg">
        Game Balance: <span className="text-orange-400">{gameBalance} TON</span>
      </div>
    </div>
  );

  // State để hiển thị thông báo lỗi
  const [errorMessage, setErrorMessage] = useState('');
  
  // Hàm mở trứng
  const openEgg = () => {
    // Kiểm tra số dư trước khi mở trứng
    if (gameBalance < egg.price) {
      setErrorMessage(`Không đủ số dư! Cần ${egg.price} TON để mở ${egg.name}.`);
      setTimeout(() => setErrorMessage(''), 3000); // Tự động ẩn thông báo sau 3 giây
      return;
    }
    
    // Trừ số dư trong game
    const newBalance = gameBalance - egg.price;
    setGameBalance(newBalance);
    
    // Cập nhật số dư thông qua API
    if (userAddress) {
      fetch(`${BACKEND_URL}/api/balance/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress, balance: newBalance })
      });
    }
    
    // Random theo rate
    const rates = egg.cats.map(cat => parseFloat(cat.rate));
    const total = rates.reduce((a, b) => a + b, 0);
    const rand = Math.random() * total;
    let acc = 0;
    let chosen = egg.cats[0];
    for (let i = 0; i < egg.cats.length; i++) {
      acc += rates[i];
      if (rand < acc) {
        chosen = egg.cats[i];
        break;
      }
    }
    setCollection(prev => [...prev, chosen]);
    setOpenedCat(chosen);
    
    // Gọi API để lưu cat này vào backend
    if (userAddress) {
      fetch(`${BACKEND_URL}/api/user/add-cat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress, cat: chosen })
      });
    }
    setTimeout(() => setOpenedCat(null), 2000); // Hiển thị cat vừa mở trong 2s
  };

  return (
    <div className="relative p-4 text-white min-h-screen" style={{ background: `url(${require('../assets/bg-space-cats.png')}) center center / cover no-repeat` }} >
      {showTotalDailyReward}
      {showGameBalance}
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl shadow p-4 w-full max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <img src="https://i.imgur.com/5cX1v5b.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-yellow-400" />
          <div>
            <div className="font-semibold">Quang Dang <span role="img" aria-label="cat">🐱</span> KittyMint</div>
            <div className="text-xs bg-yellow-900 text-yellow-400 rounded px-2 py-0.5 inline-block mt-1">Chest đã mở: {collection.length}</div>
          </div>
        </div>

        <div className="relative ml-2">
          <button
            className="flex items-center bg-[#231942] border border-[#3a2d5c] rounded-full px-2 py-1 focus:outline-none hover:bg-[#2d2052] transition"
            onClick={() => setShowLangDropdown(v => !v)}
          >
            <img src={selectedLang.flag} alt={selectedLang.label} className="w-7 h-7 rounded-full object-cover" />
            <svg className="w-3 h-3 ml-1 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-[#2d2052] rounded-xl shadow-lg py-2 z-50 border border-[#3a2d5c]">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`flex items-center w-full px-3 py-2 hover:bg-[#3a2d5c] transition text-left ${lang.code === selectedLang.code ? 'font-bold text-white' : 'text-purple-200'}`}
                  onClick={() => { setSelectedLang(lang); setShowLangDropdown(false); }}
                >
                  <img src={lang.flag} alt={lang.label} className="w-5 h-5 rounded-full object-cover mr-2" />
                  <span className="flex-1">{lang.label}</span>
                  {lang.code === selectedLang.code && (
                    <svg className="w-4 h-4 text-white ml-2" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rewards + Game Balance */}
      <div className="flex justify-between items-center bg-purple-400/80 rounded-lg px-4 py-2 mb-4 shadow-lg gap-3">
        {/* Total Reward */}
        <div className="flex-1 flex flex-col items-center">
          <div className="bg-purple-900/90 rounded-xl px-5 py-2 text-orange-300 font-bold shadow-lg text-base border border-orange-400 w-full text-center">
            {parseFloat(totalDailyReward).toFixed(4)} <img src={require('../assets/images/ton.png')} alt="TON" className="inline w-5 h-5 align-text-bottom ml-1" />
          </div>
          <div className="text-xs text-purple-300 mt-1">{texts.totalReward}</div>
        </div>
        {/* Game Balance (Ví) */}
        <div className="flex-1 flex flex-col items-center">
          <div className="bg-purple-900/90 rounded-xl px-5 py-2 text-orange-300 font-bold shadow-lg text-base border border-orange-400 w-full text-center">
            Ví: <span className="text-orange-400">{gameBalance} <img src={require('../assets/images/ton.png')} alt="TON" className="inline w-5 h-5 align-text-bottom ml-1" /></span>
          </div>
          <div className="text-xs text-purple-300 mt-1">Game Wallet</div>
        </div>
        {/* Daily Reward */}
        <div className="flex-1 flex flex-col items-center">
          <div className="bg-purple-900/90 rounded-xl px-5 py-2 text-orange-300 font-bold shadow-lg text-base border border-orange-400 w-full text-center">
            {collection.reduce((sum, cat) => sum + parseFloat(cat.earn), 0).toFixed(4)} <img src={require('../assets/images/ton.png')} alt="TON" className="inline w-5 h-5 align-text-bottom ml-1" />
          </div>
          <div className="text-xs text-purple-300 mt-1">{texts.dailyReward}</div>
        </div>
      </div>

      {/* Egg and Friends */}
      <div className="flex flex-col items-center mb-4">
        {/* Style cho animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        .animate__animated {
          animation-duration: 0.5s;
        }
        .animate__fadeInDown {
          animation-name: fadeInDown;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate3d(0, -20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
      
      <div className="flex items-center gap-4">
          {/* Left arrow */}
          <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 shadow">
            <img src={require('../assets/images/left .png')} alt="left" className="w-6 h-6" />
          </button>
          <div className="relative">
            <img src={egg.img} alt="egg" className="w-32 h-40 animate-bounce-simple" />

          </div>
          {/* Right arrow */}
          <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 shadow">
            <img src={require('../assets/images/right.png')} alt="right" className="w-6 h-6" />
          </button>
        </div>
        <button
          className="mt-2 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full px-6 py-1 font-bold text-lg focus:outline-none hover:scale-105 transition"
          onClick={openEgg}
>
          {egg.price} <img src={require('../assets/images/ton.png')} alt="TON" className="inline w-5 h-5 align-text-bottom ml-1" />
        </button>
        <button
          className="mt-1 text-sm text-purple-200 underline hover:text-orange-300 transition"
          onClick={() => setShowModal(true)}
        >
          What's Inside?
        </button>
      </div>



      {/* Hiển thị thông báo lỗi */}
      {errorMessage && (
        <div className="fixed top-20 left-0 right-0 mx-auto max-w-md z-50 animate__animated animate__fadeInDown">
          <div className="bg-gradient-to-r from-red-500 to-purple-800 rounded-xl shadow-2xl overflow-hidden border-2 border-orange-300 mx-4">
            <div className="bg-purple-950/80 backdrop-blur px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-orange-300 font-bold text-base">Không đủ TON</h3>
                  <p className="text-white text-sm">{errorMessage}</p>
                </div>
                <button className="text-white hover:text-pink-300" onClick={() => setErrorMessage('')}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 animate-shimmer" 
                 style={{
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 2s infinite linear'
                 }}></div>
          </div>
        </div>
      )}
      
      {/* Collection */}

      <EggRewardModal open={showModal} onClose={() => setShowModal(false)} egg={egg} />
      <div>
        <div className="text-lg font-semibold mb-2">{texts.collection}</div>
        <div className="flex gap-4 overflow-x-auto whitespace-nowrap py-2">
          {collection.length === 0 && <div className="text-purple-300 italic">{texts.noCats}</div>}
          {Object.entries(collection.reduce((acc, cat) => {
            if (!acc[cat.name]) {
              acc[cat.name] = { ...cat, count: 1, totalEarn: parseFloat(cat.earn) };
            } else {
              acc[cat.name].count += 1;
              acc[cat.name].totalEarn += parseFloat(cat.earn);
            }
            return acc;
          }, {})).map(([name, cat]) => (
            <div key={name} className="bg-purple-800 rounded-lg px-4 py-2 flex flex-col items-center relative inline-block shrink-0 mr-1">
              {/* Số lượng góc phải trên */}
              {cat.count > 1 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full px-2 py-0.5 shadow">x{cat.count}</div>
              )}
              <img src={require(`../assets/images/${cat.name}.png`)} alt={cat.name} className="w-10 h-10 object-contain animate-bounce-simple" />
              <div className="mt-1 font-bold">{cat.name}</div>
              <div className="text-xs">{cat.totalEarn.toFixed(3)} <img src={require('../assets/images/ton.png')} alt="TON" className="inline w-3.5 h-3.5 align-text-bottom mx-1" /> /day</div>
            </div>
          ))}
        </div>
        {openedCat && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-[#2D2052] rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center">
              <img src={require(`../assets/images/${openedCat.name}.png`)} alt={openedCat.name} className="w-20 h-20 object-contain mb-2" />
              <div className="text-xl font-bold text-white mb-1">{texts.gotCat} {openedCat.name}!</div>
              <div className="text-sm text-purple-300 mb-2">{texts.rarity}: <span className="font-semibold">{openedCat.rarity}</span></div>
              <div className="text-sm text-blue-200">{texts.earn}: {openedCat.earn} /day</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;