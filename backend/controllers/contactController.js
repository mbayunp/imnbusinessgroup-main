// backend/controllers/contactController.js
import { ContactMessage } from '../models/index.js';

// 1. Kirim Pesan (Public - Tidak butuh login)
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      status: 'unread'
    });

    res.status(201).json({ message: 'Pesan berhasil dikirim!', data: newMessage });
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({ message: 'Gagal mengirim pesan.' });
  }
};

// 2. Baca Semua Pesan (Admin Only)
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']] // Pesan terbaru di atas
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: 'Gagal mengambil pesan kontak.' });
  }
};

// 3. Hapus Pesan (Admin Only)
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Pesan tidak ditemukan' });
    }

    await message.destroy();
    res.json({ message: 'Pesan berhasil dihapus' });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ message: 'Gagal menghapus pesan.' });
  }
};