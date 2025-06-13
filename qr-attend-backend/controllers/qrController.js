import QRCode from 'qrcode';

export const generateQR = async (req, res) => {
  const { userId } = req.user;
  const data = JSON.stringify({ userId, timestamp: Date.now() });
  const qr = await QRCode.toDataURL(data);
  res.send({ qr });
};
