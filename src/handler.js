const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  // Dapatkan body request di Hapi dengan request.payload
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  /*
        createdAt dan updatedAt. Karena kasus sekarang adalah menambahkan catatan baru, berarti nilai
        kedua properti tersebut seharusnya sama.
    */
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // Masukkan nilai-nilai tersebut kedalam array notes dengan method push()
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  // Untuk cek apakah newNote udah masuk kedalam array notes belum dg pakai method filter() brdsrkn id catatan
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // Gunakan isSuccess untuk menentukan respon
  // Jika isSuccess bernilai true, silakan beri respons berhasil. Jika false, silakan beri respons gagal.
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Mendapatkan seluruh catatan
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// Menampilkan detail catatan dengan id
const getNoteByIdHandler = (request, h) => {
  // mengembalikan objek catatan secara spesifik berdasarkan id yang digunakan oleh path parameter.
  const { id } = request.params;
  // dapatkan objek note dengan id tersebut dari objek array notes. Manfaatkan method array filter() untuk mendapatkan objeknya
  const note = notes.filter((n) => n.id === id)[0];

  // kembalikan fungsi handler dengan data beserta objek note di dalamnya
  // pastikan dulu objek note tidak bernilai undefined. Bila undefined, kembalikan dengan respons gagal
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Membuat fungsi untuk mengedit notes berdasarkan id
const editNoteByIdHandler = (request, h) => {
  // Dapatkan nilai id dengan request.params
  const { id } = request.params;
  // Dapatkan data notes terbaru yang dikirimkan oleh client melalui body request.
  const { title, tags, body } = request.payload;
  // Perbarui nilai updatedAt. dapatkan nilai terbaru dengan menggunakan new Date().toISOString()
  const updatedAt = new Date().toISOString();

  // Mengubah note lama dengan yang baru
  // manfaatkan indexing array, dapatkan dulu index array pada objek catatan sesuai id yang ditentukan. Untuk melakukannya, gunakanlah method array findIndex()
  const index = notes.findIndex((note) => note.id === id); // bila tidak ditemukan, index akan bernilai -1

  if (index !== -1) {
    // Jika index telah ditemukan, simpan data (yang diperbarui) dalam index tersebut
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    // Jika data sudah berhasil disimpan (diperbarui)
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  // Jika index tidak ditemukan, jalankan perintah dibawah ini (menampilkan pesan gagal dan 404)
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Membuat fungsi untuk menghapus note berdasar ID
const deleteNoteByIdHandler = (request, h) => {
  // dapatkan dulu nilai id yang dikirim melalui path parameter
  const { id } = request.params;
  // Dapatkan index
  const index = notes.findIndex((note) => note.id === id);
  // Lakukan pengecekan nilai index
  if (index !== -1) {
    // untuk menghapus data pada array berdasarkan index, gunakan method array splice()
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // Bila index bernilai -1, return handler dg respons gagal
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Export menggunakn object literals
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
};
