// backend/controllers/careerController.js
import { Career } from '../models/index.js'; 

// Get All
const getAllCareers = async (req, res) => {
  try {
    // Urutkan dari yang terbaru
    const careers = await Career.findAll({
      order: [['postedDate', 'DESC']]
    });
    res.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ message: 'Server error fetching careers' });
  }
};

// Get By ID
const getCareerById = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);
    if (career) {
      res.status(200).json(career);
    } else {
      res.status(404).json({ message: 'Lowongan tidak ditemukan' });
    }
  } catch (error) {
    console.error("Error fetching career by ID:", error);
    res.status(500).json({ message: 'Server error fetching career by ID' });
  }
};

// Create
const createCareer = async (req, res) => {
  const { title, description, gFormLink, imageUrl } = req.body;
  const createdBy = req.user ? req.user.id : null; 

  try {
    const career = await Career.create({ 
      title,
      description,
      gFormLink,
      imageUrl, // Simpan URL gambar
      createdBy,
      postedDate: new Date()
    });

    res.status(201).json(career);
  } catch (error) {
    console.error("Error creating career post:", error);
    res.status(500).json({ message: 'Gagal membuat lowongan' });
  }
};

// Update
const updateCareer = async (req, res) => {
  const { title, description, gFormLink, imageUrl } = req.body;

  try {
    const career = await Career.findByPk(req.params.id);

    if (career) {
      await career.update({
        title: title !== undefined ? title : career.title,
        description: description !== undefined ? description : career.description,
        gFormLink: gFormLink !== undefined ? gFormLink : career.gFormLink,
        imageUrl: imageUrl !== undefined ? imageUrl : career.imageUrl, // Update hanya jika ada URL baru
      });
      res.status(200).json(career);
    } else {
      res.status(404).json({ message: 'Lowongan tidak ditemukan' });
    }
  } catch (error) {
    console.error("Error updating career post:", error);
    res.status(500).json({ message: 'Gagal memperbarui lowongan' });
  }
};

// Delete
const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);
    if (career) {
      await career.destroy(); 
      res.status(200).json({ message: 'Lowongan berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'Lowongan tidak ditemukan' });
    }
  } catch (error) {
    console.error("Error deleting career post:", error);
    res.status(500).json({ message: 'Gagal menghapus lowongan' });
  }
};

// Stats
const getCareerStats = async (req, res) => {
  try {
    const totalCareers = await Career.count(); 
    const activeCareers = totalCareers; // Bisa disesuaikan logikanya nanti
    res.status(200).json({ totalCareers, activeCareers });
  } catch (error) {
    console.error("Error fetching career stats:", error);
    res.status(500).json({ message: 'Gagal mengambil statistik karir.' });
  }
};

export {
  getAllCareers, 
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  getCareerStats
};