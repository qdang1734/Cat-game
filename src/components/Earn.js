import React from 'react';

const TEXTS = {
  en: {
    title: 'Top Tasks', done: 'Done', start: 'Start',
    tasks: [
      'Retweet Bitcoin Event on X',
      'Join Giveaway on X',
      'Shared this post on X',
      'Follow us on X',
      'Join Telegram channel',
      'Join Telegram group',
    ],
  },
  vi: {
    title: 'Nhiệm vụ nổi bật', done: 'Hoàn thành', start: 'Bắt đầu',
    tasks: [
      'Retweet sự kiện Bitcoin trên X',
      'Tham gia Giveaway trên X',
      'Chia sẻ bài này trên X',
      'Theo dõi chúng tôi trên X',
      'Tham gia kênh Telegram',
      'Tham gia nhóm Telegram',
    ],
  },
  zh: {
    title: '热门任务', done: '已完成', start: '开始',
    tasks: [
      '在X转发比特币活动',
      '参加X上的抽奖',
      '在X分享此贴',
      '关注我们X账号',
      '加入Telegram频道',
      '加入Telegram群组',
    ],
  },
  ru: {
    title: 'Лучшие задания', done: 'Готово', start: 'Начать',
    tasks: [
      'Ретвитнуть Bitcoin Event в X',
      'Участвовать в розыгрыше в X',
      'Поделиться этим постом в X',
      'Подписаться на нас в X',
      'Вступить в канал Telegram',
      'Вступить в группу Telegram',
    ],
  },
  ko: {
    title: '인기 미션', done: '완료', start: '시작',
    tasks: [
      'X에서 비트코인 이벤트 리트윗',
      'X에서 경품 참여',
      'X에 이 글 공유',
      'X에서 팔로우',
      '텔레그램 채널 가입',
      '텔레그램 그룹 가입',
    ],
  },
};

const rewards = ['+200 RCAT', '+200 RCAT', '+500 RCAT', '+250 RCAT', '+250 RCAT', '+250 RCAT'];
const doneArr = [true, false, false, false, true, true];

const Earn = ({ selectedLang }) => {
  const lang = selectedLang?.code || 'en';
  const t = TEXTS[lang] || TEXTS.en;
  return (
    <div className="p-4 text-white min-h-screen bg-gradient-to-b from-purple-900 to-black pb-16">
      <h2 className="text-xl font-bold mb-4">{t.title}</h2>
      <div className="space-y-3">
        {t.tasks.map((task, idx) => (
          <div key={idx} className={`flex items-center justify-between bg-purple-900 rounded-lg px-4 py-3 ${doneArr[idx] ? 'opacity-60' : ''}`}>
            <div>
              <div className="font-semibold">{task}</div>
              <div className="text-xs text-purple-300">{rewards[idx]}</div>
            </div>
            <button className={`ml-4 px-4 py-1 rounded-full text-xs font-bold ${doneArr[idx] ? 'bg-green-700 text-green-200' : 'bg-purple-800 text-orange-300'}`}>{doneArr[idx] ? t.done : t.start}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earn;
