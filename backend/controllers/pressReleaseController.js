// backend/controllers/pressReleaseController.js
import { PressRelease } from '../models/index.js';

// Get All
const getPressReleases = async (req, res) => {
  try {
    const pressReleases = await PressRelease.findAll({
      order: [['postedDate', 'DESC']],
    });
    res.status(200).json(pressReleases);
  } catch (error) {
    console.error("Error fetching press releases:", error);
    res.status(500).json({ message: 'Server error fetching press releases' });
  }
};

// Get By ID
const getPressReleaseById = async (req, res) => {
  try {
    const pressRelease = await PressRelease.findByPk(req.params.id);
    if (pressRelease) {
      res.status(200).json(pressRelease);
    } else {
      res.status(404).json({ message: 'Berita pers tidak ditemukan' });
    }
  } catch (error) {
    console.error("Error fetching press release by ID:", error);
    res.status(500).json({ message: 'Server error fetching press release by ID' });
  }
};

// Create
const createPressRelease = async (req, res) => {
  const { title, content, imageUrl } = req.body;
  const createdBy = req.user ? req.user.id : null;

  try {
    const pressRelease = await PressRelease.create({
      title,
      content,
      imageUrl, // Pastikan ini tersimpan
      createdBy,
      postedDate: new Date()
    });

    res.status(201).json(pressRelease);
  } catch (error) {
    console.error("Error creating press release post:", error);
    res.status(500).json({ message: 'Gagal membuat berita pers' });
  }
};

// Update
const updatePressRelease = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  try {
    const pressRelease = await PressRelease.findByPk(req.params.id);

    if (pressRelease) {
      await pressRelease.update({
        title: title !== undefined ? title : pressRelease.title,
        content: content !== undefined ? content : pressRelease.content,
        imageUrl: imageUrl !== undefined ? imageUrl : pressRelease.imageUrl,
      });
      res.status(200).json(pressRelease);
    } else {
      res.status(404).json({ message: 'Berita pers tidak ditemukan' });
    }
  } catch (error) {
    console.error("Error updating press release post:", error);
    res.status(500).json({ message: 'Gagal memperbarui berita pers' });
  }
};

// Delete
const deletePressRelease = async (req, res) => {
  try {
    const pressRelease = await PressRelease.findByPk(req.params.id);
    if (pressRelease) {
      await pressRelease.destroy();
      res.status(200).json({ message: 'Berita pers berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'Berita pers tidak ditemukan' });
    }
  } catch (error) {
    console.error("Error deleting press release post:", error);
    res.status(500).json({ message: 'Gagal menghapus berita pers' });
  }
};

// Stats
const getPressReleaseStats = async (req, res) => {
  try {
    const totalPressReleases = await PressRelease.count();
    res.status(200).json({ totalPressReleases });
  } catch (error) {
    console.error("Error fetching press release stats:", error);
    res.status(500).json({ message: 'Gagal mengambil statistik berita pers.' });
  }
};

export {
  getPressReleases,
  getPressReleaseById,
  createPressRelease,
  updatePressRelease,
  deletePressRelease,
  getPressReleaseStats
};