export default function (comp_type: string, status: string) {
  let subject: string, message: string, link = ''

  if (comp_type === 'uiux') {
    switch (status) {
      case 'approved':
        subject = 'Pengumuman Tahap Design dan Video - UI / UX Competition Binaryfest 2021'
        message = 'Sebelumnya terimakasih atas partisipasi dari teman-teman yang telah ikut serta dalam event BinaryFest 2021 kategori UI/UX DESIGN " Creative UI/UX For Company Industrial". ' +
          'Dimana kegiatan ini telah dibuka dari tanggal 14 April - 24 April 2021 ditahap pendaftaran, sampai kemaren teman-teman sudah menyelesaikan tahap design dan video ' +
          'sampai pengumpulan terakhir tanggal 7 Mei. Telah banyak karya dari teman - teman yang hasilnya sangat kreatif dan inovatif. Namun kembali lagi, semua keputusan ada di tangan dewan juri.<br><br>' +
          'Setelah melihat dan mengevaluasi hasil design anda, Kami ucapkan selamat kepada team kamu Bisa lanjut ke tahap selanjutnya.<br><br>' +
          'Untuk info tahap selanjutnya bisa mengakses link : <a href="https://bit.ly/5BesarUIUXBinaryFest">bit.ly/5BesarUIUXBinaryFest</a><br><br>' +
          'Selamat dan tetap semangat untuk tahap selanjutnya.<br>' +
          'Terima Kasih'

        return { subject, message, link }
      case 'rejected':
        subject = 'Pengumuman Tahap Design dan Video - UI / UX Competition Binaryfest 2021'
        message = 'Sebelumnya terimakasih atas partisipasi dari teman-teman yang telah ikut serta dalam event BinaryFest 2021 kategori UI/UX DESIGN " Creative UI/UX For Company Industrial".' +
          'Dimana kegiatan ini telah dibuka dari tanggal 14 April - 24 April 2021 ditahap pendaftaran, sampai kemaren teman-teman sudah menyelesaikan tahap design dan video' +
          'sampai pengumpulan terakhir tanggal 7 Mei. Telah banyak karya dari teman - teman yang hasilnya sangat kreatif dan inovatif. Namun kembali lagi, semua keputusan ada di tangan dewan juri.<br><br>' +
          'Setelah melihat dan mengevaluasi hasil design anda, Mohon maaf team kamu belum bisa lanjut ke babak selanjutnya.<br><br>' +
          'Namun jangan berputus asa, terus kembangkan keahlian teman-teman untuk semakin lebih baik. Dan bisa ikut serta di lain kegiatan.<br><br>' +
          'Terima Kasih'
        return { subject, message, link }
      default:
        break;
    }
  } else {
    switch (status) {
      case 'approved':
        subject = 'IoT Competition BinaryFest 2021 - Lolos Proposal'
        message = 'Kami ucapkan Selamat buat kamu telah lolos ke tahap selanjutnya yaitu Presentasi Finalis ✨<br><br>' +
          '🗓 Presentasi Finalis akan diadakan tanggal 7 Mei 2021.<br><br>' +
          'Persiapkan dengan sebaik mungkin dan buktikan bahwa tim anda juaranya 👊<br>'

        return { subject, message, link }
      case 'rejected':
        subject = 'IoT Competition BinaryFest 2021 - Pengumuman Proposal'
        message = 'Mohon maaf saat ini Anda belum meraih kesempatan ke tahap selanjutnya. Ini memang bukan berita yang menyenangkan karena kami sangat paham bahwa Anda telah berusaha keras mencapainya.<br><br>' +
          'Namun mari kita ingat lagi bahwa bagi seorang programmer, eror dan bug adalah hal yang biasa. Jangan takut gagal. Lebih dalam lagi, janganlah hitung berapa kali gagal, melainkan berapa banyak kemajuan yang telah Anda tercapai.<br><br>' +
          'Tenang masih ada Binaryfest selanjutnya. Buktikan bahwa tim anda bisa menjadi sang juara 👊'

        return { subject, message, link }
      default:
        break;
    }
  }
}