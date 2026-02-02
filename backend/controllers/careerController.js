// backend/controllers/careerController.js

// PERBAIKAN: Import Career dari index.js (Central Export)
import { Career } from '../models/index.js'; 

const getAllCareers = async (req, res) => {
  try {
    // Gunakan model Career langsung yang sudah di-import
    const careers = await Career.findAll();
    res.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ message: 'Server error fetching careers' });
  }
};

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

const createCareer = async (req, res) => {
  const { title, description, gFormLink, imageUrl } = req.body;
  // Pastikan req.user ada (Middleware auth harus jalan sebelumnya)
  const createdBy = req.user ? req.user.id : null; 

  try {
    const career = await Career.create({ 
      title,
      description,
      gFormLink,
      imageUrl,
      createdBy,
      postedDate: new Date()
    });

    res.status(201).json(career);
  } catch (error) {
    console.error("Error creating career post:", error);
    res.status(500).json({ message: 'Gagal membuat lowongan' });
  }
};

const updateCareer = async (req, res) => {
  const { title, description, gFormLink, imageUrl } = req.body;

  try {
    const career = await Career.findByPk(req.params.id);

    if (career) {
        await career.update({
        title: title !== undefined ? title : career.title,
        description: description !== undefined ? description : career.description,
        gFormLink: gFormLink !== undefined ? gFormLink : career.gFormLink,
        imageUrl: imageUrl !== undefined ? imageUrl : career.imageUrl,
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

const getCareerStats = async (req, res) => {
  try {
    const totalCareers = await Career.count(); 
    // Jika nanti ada status 'active', filter di sini. Sementara disamakan dulu.
    const activeCareers = totalCareers;

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