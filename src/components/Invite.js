import React from 'react';

const TEXTS = {
  en: {
    invite: 'Invite Friends', total: 'Total friends', earned: 'TON Earned', reward: 'Reward', inviteBtn: 'Invite friends',
    rule1: 'When your friend opens a chest, you get 10% TON of its value!', rule2: 'Invite 1 friend:', rule3: 'Invite 1 premium friend:', note: '*Friend open at least 1 egg'
  },
  vi: {
    invite: 'Mời bạn bè', total: 'Tổng bạn bè', earned: 'TON kiếm được', reward: 'Phần thưởng', inviteBtn: 'Mời bạn',
    rule1: 'Bạn bè mở 1 rương nhận 10% TON!', rule2: 'Mời 1 bạn:', rule3: 'Mời 1 bạn premium:', note: '*Bạn phải mở ít nhất 1 trứng'
  },
  zh: {
    invite: '邀请好友', total: '好友总数', earned: '获得TON', reward: '奖励', inviteBtn: '邀请好友',
    rule1: '好友每开一个宝箱，你将获得其价值的10% TON！', rule2: '邀请1位好友:', rule3: '邀请1位高级好友:', note: '*好友需开至少1个蛋'
  },
  ru: {
    invite: 'Пригласить друзей', total: 'Всего друзей', earned: 'TON заработано', reward: 'Награда', inviteBtn: 'Пригласить',
    rule1: 'Когда друг открывает сундук, вы получаете 10% TON от его стоимости!', rule2: 'Пригласить 1 друга:', rule3: 'Пригласить 1 премиум-друга:', note: '*Друг должен открыть хотя бы одно яйцо'
  },
  ko: {
    invite: '친구 초대', total: '총 친구', earned: '획득 TON', reward: '보상', inviteBtn: '친구 초대',
    rule1: '친구가 상자를 열면, 그 가치의 10% TON을 받습니다!', rule2: '친구 1명 초대:', rule3: '프리미엄 친구 1명 초대:', note: '*친구가 최소 1개의 알을 깨야 함'
  },
};

const Invite = ({ selectedLang }) => {
  const lang = selectedLang?.code || 'en';
  const t = TEXTS[lang] || TEXTS.en;
  return (
    <div className="p-4 text-white min-h-screen bg-gradient-to-b from-purple-900 to-black pb-16">
      <h2 className="text-xl font-bold mb-4">{t.invite}</h2>
      <div className="bg-purple-900 rounded-lg p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span>{t.total}</span>
          <span className="font-bold">1</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>{t.earned}</span>
          <span className="font-bold">0.01 ⩙</span>
        </div>
      </div>
      <div className="bg-purple-900 rounded-lg p-4 mb-4">
        <div className="mb-2 font-semibold">{t.reward}</div>
        <ul className="text-sm list-disc ml-6">
          <li><span className="text-orange-400 font-bold">{t.rule1}</span></li>
          <li><span className="text-orange-400 font-bold">{t.rule2}</span></li>
        </ul>
        <div className="text-xs mt-2 text-purple-300">{t.note}</div>
      </div>
      <button className="w-full bg-gradient-to-r from-pink-400 to-orange-400 rounded-full py-2 mt-4 font-bold text-lg">{t.inviteBtn}</button>
    </div>
  );
};

export default Invite;
