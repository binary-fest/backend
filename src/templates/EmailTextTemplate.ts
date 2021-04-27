export default function(comp_type:string, status:string) {
  let subject:string, message: string, link = ''

  if (comp_type === 'uiux') {
    switch (status) {
      case 'approved':
        subject = 'UI/UX Competition BinaryFest 2021 - Lolos Pendaftaran'
        message = 'Halo!, Kami dari panitia UI/UX Competition BinaryFest datang memberi kabar baik bahwasanya,<br><br>'+
        'Selamat Tim kamu berhasil dan lolos di tahap pendaftaran, untuk selanjutnya masuk ke grup whatsapp dengan klik link dibawah ini, Terimakasih telah menunggu :)<br>'
        link = 'bit.ly/GrupUIUXBinaryFest'

        return {subject, message, link}
      case 'rejected':
        subject = 'UI/UX Competition BinaryFest 2021 - Pengumuman Pendaftaran'
        message = 'Mohon maaf saat ini Anda belum meraih kesempatan ke tahap selanjutnya. Ini memang bukan berita yang menyenangkan karena kami sangat paham bahwa Anda telah berusaha keras mencapainya.<br><br>'+
        'Namun mari kita ingat lagi bahwa bagi seorang programmer, eror dan bug adalah hal yang biasa. Jangan takut gagal. Lebih dalam lagi, janganlah hitung berapa kali gagal, melainkan berapa banyak kemajuan yang telah Anda tercapai.<br><br>'+
        'Tenang masih ada Binaryfest selanjutnya. Buktikan bahwa tim anda bisa menjadi sang juara 👊'

        return {subject, message, link} 
      default:
        break;
    }
  } else {
    switch (status) {
      case 'approved':
        subject = 'IoT Competition BinaryFest 2021 - Lolos Proposal'
        message = 'Kami ucapkan Selamat buat kamu telah lolos ke tahap selanjutnya yaitu Presentasi Finalis ✨<br><br>'+
        '🗓 Presentasi Finalis akan diadakan tanggal 7 Mei 2021.<br><br>'+
        'Persiapkan dengan sebaik mungkin dan buktikan bahwa tim anda juaranya 👊<br>'

        return {subject, message, link}
      case 'rejected':
        subject = 'IoT Competition BinaryFest 2021 - Pengumuman Proposal'
        message = 'Mohon maaf saat ini Anda belum meraih kesempatan ke tahap selanjutnya. Ini memang bukan berita yang menyenangkan karena kami sangat paham bahwa Anda telah berusaha keras mencapainya.<br><br>' +
          'Namun mari kita ingat lagi bahwa bagi seorang programmer, eror dan bug adalah hal yang biasa. Jangan takut gagal. Lebih dalam lagi, janganlah hitung berapa kali gagal, melainkan berapa banyak kemajuan yang telah Anda tercapai.<br><br>' +
          'Tenang masih ada Binaryfest selanjutnya. Buktikan bahwa tim anda bisa menjadi sang juara 👊'
        
        return {subject, message, link}
      default:
        break;
    }
  }
}