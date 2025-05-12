import React from 'react';

const TEXTS = {
  en: { Home: 'Home', Stats: 'Stats', Invite: 'Invite', Quest: 'Quest', Wallet: 'Wallet' },
  vi: { Home: 'Trang chủ', Stats: 'Thống kê', Invite: 'Mời', Quest: 'Nhiệm vụ', Wallet: 'Ví' },
  zh: { Home: '首页', Stats: '统计', Invite: '邀请', Quest: '任务', Wallet: '钱包' },
  ru: { Home: 'Главная', Stats: 'Статистика', Invite: 'Пригласить', Quest: 'Задание', Wallet: 'Кошелек' },
  ko: { Home: '홈', Stats: '통계', Invite: '초대', Quest: '퀘스트', Wallet: '지갑' },
};

const tabs = [
  { name: 'Home', icon: require('../assets/images/Status.png') },
  { name: 'Stats', icon: require('../assets/images/Status.png') },
  { name: 'Invite', icon: require('../assets/images/invite.png') },
  { name: 'Quest', icon: require('../assets/images/quest.png') },
  { name: 'Wallet', icon: require('../assets/images/wallet.png') },
];

const TabBar = ({ active, onChange, selectedLang }) => {
  const lang = selectedLang?.code || 'en';
  const texts = TEXTS[lang] || TEXTS.en;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-purple-950 flex justify-around py-2 border-t border-purple-800 z-50">
      {tabs.map(tab => (
        <button
          key={tab.name}
          className={`flex flex-col items-center text-xs focus:outline-none transition-all duration-200 ${active === tab.name ? 'text-orange-400' : 'text-purple-200'}`}
          onClick={() => onChange(tab.name)}
        >
          <span className={`w-10 h-10 mb-1 flex items-center justify-center rounded-xl transition-all duration-200 ${active === tab.name ? 'bg-gradient-to-b from-[#2d1e2f] to-[#3d314a] border-2 border-orange-300 shadow-[0_0_10px_2px_rgba(255,170,80,0.3)]' : 'bg-white/10'}`}>
            <img src={tab.icon} alt={tab.name} className="w-7 h-7 object-cover rounded-full" />
          </span>
          <span className={`transition-all duration-200 ${active === tab.name ? 'font-semibold text-orange-300 drop-shadow-[0_0_2px_#fff]' : ''}`}>{texts[tab.name]}</span>
        </button>
      ))}
    </div>
  );
};

export default TabBar;
