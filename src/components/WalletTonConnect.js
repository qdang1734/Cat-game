import React, { useEffect, useState } from 'react';
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

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

const WalletTonConnect = ({ selectedLang, refreshGameBalance }) => {
  const userAddress = useTonAddress();
  const isConnected = Boolean(userAddress);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [tonConnectUI] = useTonConnectUI();

  // Lấy số dư tự động
  useEffect(() => {
    if (!isConnected) return;
    fetch(`${BACKEND_URL}/api/balance/${userAddress}`)
      .then(res => res.json())
      .then(data => setBalance(data.balance || 0));
  }, [userAddress, isConnected]);

  // Xử lý nạp: tạo giao dịch gửi TON từ ví người chơi tới ví game
  const handleDeposit = async () => {
    setMessage("");
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      setMessage("Vui lòng nhập số TON hợp lệ!");
      return;
    }
    setLoading(true);
    try {
      // Tạo giao dịch gửi TON bằng TonConnect UI SDK
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 6000, // 10 phút
        messages: [
          {
            address: GAME_WALLET,
            amount: (Number(depositAmount) * 1e9).toString(), // Chuyển TON về nanoTON
          },
        ],
      });
      // Sau khi gửi, gọi backend kiểm tra giao dịch nạp
      const resp = await fetch(`${BACKEND_URL}/api/check-deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress })
      });
      const result = await resp.json();
      console.log("DEBUG check-deposit response:", result);
      if (result.success) {
        setMessage(`Nạp thành công: +${result.amount} TON!`);
        setBalance(balance + result.amount);
        if (refreshGameBalance) refreshGameBalance();
      } else {
        setMessage("Không tìm thấy giao dịch nạp. Vui lòng thử lại sau!");
      }
    } catch (e) {
      setMessage("Lỗi khi gửi giao dịch hoặc kiểm tra nạp!");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý rút
  const handleWithdraw = async () => {
    setMessage("");
    if (balance <= 0) {
      setMessage("Không đủ số dư để rút!");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND_URL}/api/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress, amount: balance })
      });
      const result = await resp.json();
      if (result.success) {
        setMessage("Rút thành công!");
        setBalance(0);
        if (refreshGameBalance) refreshGameBalance();
      } else {
        setMessage(result.error || "Lỗi khi rút tiền!");
      }
    } catch (e) {
      setMessage("Lỗi khi gửi yêu cầu rút!");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const t = TEXTS[selectedLang] || TEXTS.vi;

  return (
    <div className="flex justify-center items-center min-h-[400px] p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900 rounded-2xl shadow-lg p-6 relative flex flex-col gap-6">
        {/* Header: Logo + Connect Button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#0098EA"/><path d="M16 7L25 24H7L16 7Z" fill="#fff"/></svg>
            <span className="text-xl font-bold text-white tracking-wide">TON Wallet</span>
          </div>
          <TonConnectButton />
        </div>

        {/* Wallet Address */}
        <div className="w-full flex flex-col items-center mb-2">
          <label className="text-xs text-purple-300 font-semibold mb-1">Địa chỉ ví</label>
          <div className="text-xs text-purple-200 font-mono break-all text-center bg-blue-950/60 px-3 py-2 rounded-lg w-full">
            {isConnected ? userAddress : <span className="italic text-gray-400">(Chưa kết nối)</span>}
          </div>
        </div>

        {/* Balance Card */}
        <div className="flex flex-col items-center bg-blue-950/70 rounded-xl py-6 px-4 shadow-inner">
          <div className="text-sm text-purple-300 mb-1">Số dư ví</div>
          <div className="flex items-center gap-2 mb-1">
            <svg width="22" height="22" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#0098EA"/><path d="M16 7L25 24H7L16 7Z" fill="#fff"/></svg>
            <span className="text-3xl font-extrabold text-white">{balance}</span>
            <span className="text-base text-blue-300 font-semibold">TON</span>
          </div>
        </div>

        {/* Actions: Deposit & Withdraw (side by side) */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          {/* Deposit */}
          <div className="flex-1 flex flex-col items-center bg-purple-900/70 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-200 font-semibold">Nạp TON</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M10 2v16M10 18l-6-6m6 6l6-6" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex gap-2 w-full">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Số TON muốn nạp"
                className="px-3 py-2 rounded-lg bg-purple-950 text-white text-sm w-full outline-none border border-purple-700 focus:border-blue-400 transition"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                disabled={!isConnected || loading}
              />
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 px-5 py-2 rounded-lg text-white font-bold text-sm shadow-md disabled:opacity-50"
                onClick={handleDeposit}
                disabled={!isConnected || loading}
              >
                <span className="inline-flex items-center gap-1">
                  <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M10 2v16M10 18l-6-6m6 6l6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Nạp
                </span>
              </button>
            </div>
          </div>
          {/* Withdraw */}
          <div className="flex-1 flex flex-col items-center bg-purple-900/70 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-200 font-semibold">Rút TON</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M10 18V2M10 2l-6 6m6-6l6 6" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <button
              className="bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 px-8 py-2 rounded-lg text-white font-bold text-sm shadow-md disabled:opacity-50 w-full"
              onClick={handleWithdraw}
              disabled={!isConnected || loading || balance <= 0}
            >
              <span className="inline-flex items-center gap-1 justify-center">
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M10 18V2M10 2l-6 6m6-6l6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Rút TON
              </span>
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        <div className="min-h-[28px] mt-2">
          {loading && (
            <div className="text-xs text-yellow-300 text-center animate-pulse">Đang xử lý...</div>
          )}
          {message && (
            <div className={`text-xs text-center font-semibold ${message.includes('thành công') ? 'text-green-400' : 'text-red-400'}`}>{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletTonConnect;
