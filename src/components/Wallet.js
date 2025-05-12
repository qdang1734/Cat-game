import React, { Suspense } from 'react';

const isBrowserWithStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage && !!window.sessionStorage;
  } catch (e) {
    return false;
  }
};

const TEXTS = {
  en: {
    wallet: 'Wallet', total: 'Total assets', rcat: 'Reward Cat', deposit: 'Deposit', withdraw: 'Withdraw'
  },
  vi: {
    wallet: 'Ví', total: 'Tổng tài sản', rcat: 'Mèo thưởng', deposit: 'Nạp', withdraw: 'Rút'
  },
  zh: {
    wallet: '钱包', total: '总资产', rcat: '奖励猫', deposit: '充值', withdraw: '提现'
  },
  ru: {
    wallet: 'Кошелек', total: 'Всего средств', rcat: 'Наградной кот', deposit: 'Пополнить', withdraw: 'Вывести'
  },
  ko: {
    wallet: '지갑', total: '총 자산', rcat: '보상 고양이', deposit: '입금', withdraw: '출금'
  },
};

const BACKEND_URL = "http://localhost:3001"; // Đổi thành domain backend khi deploy
const GAME_WALLET = "UQANJGqFrn96wqLaDQz4O2pVcTt1m-IRpf6aH-i-KpamjONa";

const WalletTonConnect = React.lazy(() => import('./WalletTonConnect'));

const Wallet = (props) => {
  if (!isBrowserWithStorage()) {
    return <div style={{color: 'red'}}>Không thể sử dụng TON Wallet trên môi trường này (trình duyệt không hỗ trợ storage).</div>;
  }
  return (
    <Suspense fallback={<div>Đang tải ví...</div>}>
      <WalletTonConnect {...props} />
    </Suspense>
  );
};

export default Wallet;
