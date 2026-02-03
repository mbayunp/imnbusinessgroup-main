// backend/controllers/contactController.js
import { ContactMessage } from '../models/index.js';

export const createContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    const newMessage = await ContactMessage.create({
      name: `${firstName} ${lastName || ''}`.trim(),
      email,
      phone,
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

export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil pesan.' });
  }
};

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