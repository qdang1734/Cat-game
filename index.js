// Kitty Mint Backend - Express server
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import { TonClient, WalletContractV4, fromNano, toNano } from "ton";
import { mnemonicToWalletKey } from "ton-crypto";

const app = express();
const PORT = 4001;
const TONAPI_URL = "https://tonapi.io/v2/blockchain/accounts";
const GAME_WALLET = "UQANJGqFrn96wqLaDQz4O2pVcTt1m-IRpf6aH-i-KpamjONa"; // Địa chỉ ví game thực tế

app.use(cors());
app.use(bodyParser.json());

// Đơn giản: lưu số dư user vào file users.json
function getUserData() {
  if (!fs.existsSync("users.json")) return {};
  return JSON.parse(fs.readFileSync("users.json", "utf-8"));
}
function saveUserData(data) {
  fs.writeFileSync("users.json", JSON.stringify(data, null, 2));
}

// API: Kiểm tra giao dịch nạp
app.post("/api/check-deposit", async (req, res) => {
  const { userAddress } = req.body;
  console.log('DEBUG userAddress from frontend:', userAddress);
  // Gọi Toncenter API lấy list giao dịch vào ví game
  try {
    const { data } = await axios.get(`${TONAPI_URL}/${GAME_WALLET}/transactions?limit=50`);
    // TonAPI trả về data.transactions là mảng giao dịch
    const sources = data.transactions.map(tx => tx.in_msg && tx.in_msg.source).filter(Boolean);
    console.log('DEBUG nguồn gửi đến GAME_WALLET (in_msg.source):', sources);
    // In chi tiết 20 giao dịch đầu tiên
    console.log('DEBUG 20 giao dịch trả về:', JSON.stringify(data.transactions.slice(0, 20), null, 2));
    // Chuẩn hóa địa chỉ: bỏ ký tự đầu/cuối để so sánh, chỉ xử lý nếu là string
    const normalize = addr => (typeof addr === "string" ? addr.slice(1, -1) : "");
    const tx = data.transactions.find(
      (tx) => tx.in_msg && normalize(tx.in_msg.source) === normalize(userAddress) && Number(tx.in_msg.value) > 0
    );
    if (tx) {
      // Cộng số dư cho user
      const users = getUserData();
      users[userAddress] = (users[userAddress] || 0) + Number(tx.in_msg.value) / 1e9;
      saveUserData(users);
      return res.json({ success: true, amount: Number(tx.in_msg.value) / 1e9 });
    }
    res.json({ success: false });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Rút TON về ví user
app.post("/api/withdraw", async (req, res) => {
  const { userAddress, amount } = req.body;
  const users = getUserData();
  if (!users[userAddress] || users[userAddress] < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }
  try {
    // Seed phrase (private key) ví game
    const MNEMONIC = "science deny chase foster canoe badge panic setup two kiwi swing faint area letter staff hollow arm hybrid gain certain interest hard security dynamic";
    const client = new TonClient({ endpoint: "https://toncenter.com/api/v2/jsonRPC", apiKey: TONCENTER_KEY });
    const keyPair = await mnemonicToWalletKey(MNEMONIC.split(" "));
    const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
    const sender = client.open(wallet);
    const seqno = await sender.getSeqno();
    // Gửi giao dịch
    await sender.sendTransfer({
      secretKey: keyPair.secretKey,
      to: userAddress,
      value: toNano(amount),
      seqno,
      payload: "Withdraw from Kitty Mint Game"
    });
    users[userAddress] -= amount;
    saveUserData(users);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Lấy số dư
// API: Tổng số TON Daily Reward user đã nhận
app.get("/api/daily-reward/total/:userAddress", (req, res) => {
  const users = getUserData();
  const user = users[req.params.userAddress];
  // Nếu user là object và có dailyRewardTotal thì trả về, không thì trả về 0
  let total = 0;
  if (typeof user === 'object' && user !== null && user.dailyRewardTotal) {
    total = user.dailyRewardTotal;
  }
  res.json({ total });
});

// API: Nhận Daily Reward (0.1 TON mỗi 24h)
app.post("/api/daily-reward/claim", (req, res) => {
  const { userAddress } = req.body;
  const users = getUserData();
  if (!users[userAddress] || typeof users[userAddress] !== 'object') {
    users[userAddress] = { balance: 0, dailyRewardTotal: 0, lastDailyRewardAt: 0, cats: [] };
  }
  const user = users[userAddress];
  if (!Array.isArray(user.cats)) user.cats = [];
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  // Tính tổng earn/day từ các cat user sở hữu
  let reward = 0;
  user.cats.forEach(cat => {
    // cat.earn có thể là "0.01 TON" hoặc số, cần chuẩn hóa
    if (typeof cat.earn === 'string') {
      const match = cat.earn.match(/([0-9.]+)/);
      if (match) reward += parseFloat(match[1]);
    } else if (typeof cat.earn === 'number') {
      reward += cat.earn;
    }
  });
  if (reward === 0) {
    return res.json({ success: false });
  }
  if (!user.lastDailyRewardAt || now - user.lastDailyRewardAt >= ONE_DAY) {
    user.balance = (user.balance || 0) + reward;
    user.dailyRewardTotal = (user.dailyRewardTotal || 0) + reward;
    user.lastDailyRewardAt = now;
    saveUserData(users);
    return res.json({ success: true, reward, nextClaim: now + ONE_DAY });
  } else {
    // Chưa đủ 24h
    return res.json({ success: false, nextClaim: user.lastDailyRewardAt + ONE_DAY });
  }
});

app.get("/api/balance/:userAddress", (req, res) => {
  const users = getUserData();
  // Nếu user là object thì lấy balance, nếu là số thì trả về luôn
  const user = users[req.params.userAddress];
  let balance = 0;
  if (typeof user === 'object' && user !== null && user.balance) {
    balance = user.balance;
  } else if (typeof user === 'number') {
    balance = user;
  }
  res.json({ balance });
});

// API Cập nhật số dư trong game (sử dụng khi mua/mở egg)
app.post("/api/balance/update", (req, res) => {
  const { userAddress, balance } = req.body;
  
  if (!userAddress || balance === undefined) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }
  
  const users = getUserData();
  
  // Nếu chưa có dữ liệu user hoặc dữ liệu không phải object
  if (!users[userAddress] || typeof users[userAddress] !== 'object') {
    users[userAddress] = { 
      balance: parseFloat(balance), 
      dailyRewardTotal: 0, 
      lastDailyRewardAt: 0, 
      cats: [] 
    };
  } else {
    // Nếu là object, cập nhật balance
    users[userAddress].balance = parseFloat(balance);
  }
  
  saveUserData(users);
  
  res.json({ success: true, balance: users[userAddress].balance });
});

// API lấy 50 cat gần nhất mà tất cả người chơi đã mở
app.get('/api/latest-cats', (req, res) => {
  const users = getUserData();
  const allCats = [];
  
  // Tập hợp tất cả cat với thông tin người chơi
  Object.keys(users).forEach(userAddress => {
    const user = users[userAddress];
    if (Array.isArray(user.cats)) {
      user.cats.forEach(cat => {
        // Trích xuất 2-5 ký tự đầu của địa chỉ để hiển thị ngắn gọn
        const shortAddress = userAddress.substring(0, 5) + '...' + userAddress.substring(userAddress.length - 4);
        
        // Nếu không có timestamp, gán một giá trị ngẫu nhiên
        const timestamp = cat.openedAt || Date.now() - Math.floor(Math.random() * 1000000000);
        
        allCats.push({
          name: shortAddress,
          avatar: `https://i.pravatar.cc/40?u=${userAddress}`, // Tạo avatar placeholder 
          item: {
            name: cat.name,
            // Chỉ trả về tên cat để frontend tự lấy ảnh tương ứng
            earn: typeof cat.earn === 'string' ? cat.earn.replace(' TON', '') : cat.earn
          },
          openedAt: timestamp
        });
      });
    }
  });
  
  // Sắp xếp theo thời gian mới nhất và lấy 50 mục
  const latestCats = allCats
    .sort((a, b) => b.openedAt - a.openedAt)
    .slice(0, 50);
  
  return res.json({ success: true, cats: latestCats });
});

app.listen(PORT, () => {
  console.log(`Kitty Mint backend running at http://localhost:${PORT}`);
});
