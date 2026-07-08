import {
  Ranting,
  Pengurus,
  Kader,
  Kegiatan,
  TransparansiDana,
  KoinS3,
  Persuratan,
  Usaha,
  SaranaIbadah,
  SaranaPendidikan,
  Berita,
  Dokumentasi,
  Aspirasi
} from '../types';

export const mockRantings: Ranting[] = [
  { id: 'mwc', name: 'MWC NU BUNGAH', village: 'Bungah', established: '1965-08-15' },
  { id: 'r1', name: 'PRNU ABAR-ABIR', village: 'Abar-Abir', established: '1970-03-12' },
  { id: 'r2', name: 'PRNU MELIRANG', village: 'Melirang', established: '1972-11-05' },
  { id: 'r3', name: 'PR NU BEDANTEN', village: 'Bedanten', established: '1975-01-20' },
  { id: 'r4', name: 'PRNU PEGUNDAN', village: 'Pegundan', established: '1978-05-18' },
  { id: 'r5', name: 'PRNU SIDOKUMPUL', village: 'Sidokumpul', established: '1974-09-22' },
  { id: 'r6', name: 'PRNU KISIK', village: 'Kisik', established: '1980-02-10' },
  { id: 'r7', name: 'PRNU GROGOL', village: 'Grogol', established: '1982-06-14' },
  { id: 'r8', name: 'PRNU MASANGAN', village: 'Masangan', established: '1979-04-30' },
  { id: 'r9', name: 'PRNU LEBAK', village: 'Lebak', established: '1985-08-11' },
  { id: 'r10', name: 'PRNU SUNGONLEGOWO', village: 'Sungonlegowo', established: '1977-10-01' },
  { id: 'r11', name: 'PRNU WATUAGUNG', village: 'Watuagung', established: '1983-12-15' },
  { id: 'r12', name: 'RANTING NU MOJOPURO WETAN', village: 'Mojopuro Wetan', established: '1986-07-20' },
  { id: 'r13', name: 'Roudlotut Thoyyibah', village: 'Bungah', established: '1984-05-25' },
  { id: 'r14', name: 'PRNU KARANGLIMAN', village: 'Karangliman', established: '1987-11-03' },
  { id: 'r15', name: 'PRNU MOJOPUROGEDE', village: 'Mojopurogede', established: '1981-01-14' },
  { id: 'r16', name: 'PRNU PERENG KULON', village: 'Pereng Kulon', established: '1988-04-22' },
  { id: 'r17', name: 'PRNU BUNGAH', village: 'Bungah', established: '1970-01-01' },
  { id: 'r18', name: 'PRNU PERENG WETAN', village: 'Pereng Wetan', established: '1989-08-30' },
  { id: 'r19', name: 'PRNU GUMENG', village: 'Gumeng', established: '1982-12-12' },
  { id: 'r20', name: 'PRNU KRAMAT', village: 'Kramat', established: '1985-06-15' },
  { id: 'r21', name: 'PRNU TAJUNGWIDORO', village: 'Tajungwidoro', established: '1983-09-09' },
  { id: 'r22', name: 'PRNU SIDOMUKTI', village: 'Sidomukti', established: '1980-05-18' },
  { id: 'r23', name: 'PRNU SUKOWATI', village: 'Sukowati', established: '1984-11-11' },
  { id: 'r24', name: 'PRNU RACI WETAN', village: 'Raci Wetan', established: '1986-02-28' },
  { id: 'r25', name: 'PRNU RACI DELANYAR', village: 'Raci Delanyar', established: '1988-07-07' },
  { id: 'r26', name: 'PRNU SIDOREJO', village: 'Sidorejo', established: '1981-12-25' },
  { id: 'r27', name: 'PRNU SUKOREJO', village: 'Sukorejo', established: '1983-04-10' },
  { id: 'r28', name: 'PRNU Indrodelik', village: 'Indrodelik', established: '1985-08-11' }
];

export const mockPengurus: Pengurus[] = [
  // MWC NU BUNGAH
  {
    id: 'p1',
    name: 'KH. Soeratin Abbas',
    role: 'Syuriah (Rais)',
    category: 'MWC',
    phone: '08123260605',
    kaderisasiStatus: 'Penyetaraan',
    education: 'Pesantren',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p2',
    name: "KH. Muhammad Ala'uddin, LC, M.SEI",
    role: 'Tanfidziyah (Ketua)',
    category: 'MWC',
    phone: '087854116511',
    kaderisasiStatus: 'MKNU',
    education: 'S2',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  // PRNU ABAR ABIR
  {
    id: 'p3',
    name: 'KH FATKHAN ANWARI, S.Ag.',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r1',
    phone: '081543445767',
    kaderisasiStatus: 'BELUM',
    education: 'S1',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p4',
    name: 'MUHAMMAD YASIN, ST',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r1',
    phone: '082132317474',
    kaderisasiStatus: 'BELUM',
    education: 'S1'
  },
  // PR NU BEDANTEN
  {
    id: 'p5',
    name: 'KH. Rofiqul Amin, S.Pd.',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r3',
    phone: '081332570991',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1'
  },
  {
    id: 'p6',
    name: 'Syukri Ghozali, S.Pd.',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r3',
    phone: '081357334667',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1'
  },
  // PRNU BUNGAH
  {
    id: 'p7',
    name: 'H. Nur Syahid',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r17',
    phone: '085101266542',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1'
  },
  {
    id: 'p8',
    name: 'Hamdi Ahmadi Mushzabi, M.Pd.',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r17',
    phone: '081292928115',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S2'
  },
  // PRNU GROGOL
  {
    id: 'p9',
    name: 'Imam Muslih, S.Pd.I.',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r7',
    phone: '085733860176',
    kaderisasiStatus: 'BELUM',
    education: 'S1'
  },
  {
    id: 'p10',
    name: 'Muzhafir, S.Ag.',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r7',
    phone: '085733884382',
    kaderisasiStatus: 'BELUM',
    education: 'S1'
  },
  // PRNU GUMENG
  {
    id: 'p11',
    name: 'H. MUDHOFFAR',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r19',
    phone: '08557048248',
    kaderisasiStatus: 'BELUM',
    education: 'Pesantren'
  },
  {
    id: 'p12',
    name: 'AHMAD SYAUQI THOHA',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r19',
    phone: '085804485256',
    kaderisasiStatus: 'BELUM',
    education: 'S1'
  },
  // PRNU INDRODELIK
  {
    id: 'p13',
    name: 'Ali Murtadlo S.Pd.i',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r9',
    phone: '085102643003',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1'
  },
  {
    id: 'p14',
    name: 'Drs. H. Ahmad Djamil M.Pd',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r9',
    phone: '085748839722',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S2'
  }
];

export const mockKader: Kader[] = [
  {
    id: 'k1',
    name: 'Alek Salim, M.Pd',
    pob: 'Gresik',
    dob: '1985-05-15',
    gender: 'Laki-laki',
    banom: 'Ansor',
    role: 'Ketua PAC GP Anshor MWC NU BUNGAH',
    rantingId: 'mwc',
    phone: '0815515224710',
    joinYear: 2010
  },
  {
    id: 'k2',
    name: 'Ainul Mahmudah, M.Pd.I',
    pob: 'Gresik',
    dob: '1988-08-20',
    gender: 'Perempuan',
    banom: 'Fatayat',
    role: 'Ketua PAC Fatayat MWC NU BUNGAH',
    rantingId: 'mwc',
    phone: '085105113443',
    joinYear: 2012
  },
  {
    id: 'k3',
    name: 'M. Baihaqi Alamsyah',
    pob: 'Gresik',
    dob: '2001-11-12',
    gender: 'Laki-laki',
    banom: 'IPNU',
    role: 'Ketua PAC IPNU MWC NU BUNGAH',
    rantingId: 'mwc',
    phone: '0858595242877',
    joinYear: 2018
  },
  {
    id: 'k4',
    name: 'Erniawati',
    pob: 'Gresik',
    dob: '2002-04-18',
    gender: 'Perempuan',
    banom: 'IPPNU',
    role: 'Ketua PAC IPPNU MWC NU BUNGAH',
    rantingId: 'mwc',
    phone: '085755920527',
    joinYear: 2019
  },
  {
    id: 'k5',
    name: 'AYATULLAH KAUNANG',
    pob: 'Abar-Abir',
    dob: '1990-10-10',
    gender: 'Laki-laki',
    banom: 'Ansor',
    role: 'Ketua Ranting Anshor Abar-Abir',
    rantingId: 'r1',
    phone: '081937881756',
    joinYear: 2015
  },
  {
    id: 'k6',
    name: 'WIWIN RAHMAWATI',
    pob: 'Abar-Abir',
    dob: '1992-02-14',
    gender: 'Perempuan',
    banom: 'Fatayat',
    role: 'Ketua Ranting Fatayat Abar-Abir',
    rantingId: 'r1',
    phone: '085607473193',
    joinYear: 2016
  }
];

export const mockKegiatan: Kegiatan[] = [
  {
    id: 'e1',
    title: 'RTL PD PKP 40 MWC NU Bungah',
    date: '2025-01-11',
    location: 'Gedung MWCNU Bungah',
    organizer: 'MWC NU BUNGAH',
    targetGroup: 'Kader PKP 40 (93 orang)',
    fundingSource: 'Kas Jamiyah',
    budget: 2700000,
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    description: 'Rencana Tindak Lanjut Pendidikan Kader Penggerak angkatan ke-40 se-Kecamatan Bungah.'
  },
  {
    id: 'e2',
    title: 'Pendidikan Kader Penggerak (PD PKP 40)',
    date: '2025-01-03',
    location: 'Gedung MWCNU Bungah',
    organizer: 'MWC NU BUNGAH',
    targetGroup: 'Panitia dan Peserta MWCNU (93 orang)',
    fundingSource: 'Kas Jamiyah',
    budget: 27400000,
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    description: 'Pendidikan kader penggerak utama untuk memperkokoh militansi kader di MWC NU Bungah.'
  },
  {
    id: 'e3',
    title: 'PD-PKPNU Angkatan 35',
    date: '2024-08-09',
    location: 'UNIVERSITAS QOMARUDDIN',
    organizer: 'MWC NU BUNGAH',
    targetGroup: 'Kader MWC Bungah (63 orang)',
    fundingSource: 'Kas Jamiyah',
    budget: 21300000,
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140e2b8?w=800&auto=format&fit=crop&q=80',
    description: 'Pendidikan Kader Penggerak Nahdlatul Ulama tingkat MWC yang bertempat di kompleks Universitas Qomaruddin.'
  },
  {
    id: 'e4',
    title: 'Stand MTQ Kabupaten Gresik',
    date: '2024-10-05',
    location: 'Lapangan Desa Bungah',
    organizer: 'PAC IPNU IPPNU Bungah',
    targetGroup: 'Pengunjung MTQ Kabupaten',
    fundingSource: 'Sponsor',
    budget: 9000000,
    status: 'Selesai',
    description: 'Pembuatan stand pameran dan bursa wirausaha kreatif IPNU IPPNU di lokasi perhelatan MTQ tingkat Kabupaten.'
  },
  {
    id: 'e5',
    title: 'LAILATUL HADROH PRNU ABAR ABIR',
    date: '2024-11-20',
    location: 'MASJID BAITUL ABROR',
    organizer: 'PRNU ABAR-ABIR',
    targetGroup: 'Jamaah ISHARI PRNU (1000 orang)',
    fundingSource: 'Donatur',
    budget: 50000000,
    status: 'Selesai',
    description: 'Majelis besar zikir, shalawat, dan hadrah bersama jamaah ISHARI se-Kecamatan Bungah.'
  }
];

export const mockTransparansiDana: TransparansiDana[] = [
  {
    id: 'f1',
    date: '2026-06-01',
    type: 'Masuk',
    category: 'Iuran Anggota',
    amount: 12500000,
    description: 'Iuran wajib syahriyah dari jajaran PRNU se-Kecamatan Bungah',
    pic: 'H. Khoirul Anam'
  },
  {
    id: 'f2',
    date: '2026-06-10',
    type: 'Masuk',
    category: 'Donasi Publik',
    amount: 7500000,
    description: 'Infaq kotak amal kantor MWC NU dan donatur tetap bulanan',
    pic: 'Zainul Arifin, M.Pd.I.'
  },
  {
    id: 'f3',
    date: '2026-06-12',
    type: 'Keluar',
    category: 'Operasional Kantor',
    amount: 1800000,
    description: 'Pembayaran tagihan listrik, internet kantor, dan ATK operasional sekretariat MWC',
    pic: 'Sekretariat'
  }
];

export const mockKoinS3: KoinS3[] = [
  { id: 's1', month: '2026-06', rantingId: 'mwc', amount: 350000000, distributionTarget: 'RSNU PCNU GRESIK', distributionAmount: 250000000 },
  { id: 's2', month: '2026-06', rantingId: 'r1', amount: 10000000, distributionTarget: "Santunan & Pendidikan JAM'IYAH ABAR-ABIR", distributionAmount: 10000000 },
  { id: 's3', month: '2026-06', rantingId: 'r3', amount: 8000000, distributionTarget: 'Rumah dhuafa Bedanten', distributionAmount: 6000000 },
  { id: 's4', month: '2026-06', rantingId: 'r17', amount: 45611000, distributionTarget: 'Pembangunan Rumah Sakit PCNU', distributionAmount: 45611000 },
  { id: 's5', month: '2026-06', rantingId: 'r17', amount: 8000000, distributionTarget: 'Paving Gedung MWC NU Bungah', distributionAmount: 8000000 },
  { id: 's6', month: '2026-06', rantingId: 'r7', amount: 1300000, distributionTarget: 'Masyarakat dhuafa Grogol', distributionAmount: 1000000 },
  { id: 's7', month: '2026-06', rantingId: 'r19', amount: 1500000, distributionTarget: 'Sembako warga Gumeng', distributionAmount: 1500000 }
];

export const mockPersuratan: Persuratan[] = [
  {
    id: 'sr1',
    letterNumber: '112/MWC.NU-Bungah/A.I/VI/2026',
    type: 'Keluar',
    code: 'A.I (Internal)',
    senderOrRecipient: 'Seluruh Pimpinan Ranting NU se-Kecamatan Bungah',
    date: '2026-06-28',
    subject: 'Undangan Rapat Pleno Rutin Evaluasi Triwulan Koin S3 LAZISNU',
    tembusan: 'PCNU Gresik'
  },
  {
    id: 'sr2',
    letterNumber: 'PC-11/A-V/G-31/V/2026',
    type: 'Masuk',
    code: 'A-V (Instruksi PCNU)',
    senderOrRecipient: 'PCNU Kabupaten Gresik',
    date: '2026-06-24',
    subject: 'Instruksi Pengerahan Pasukan Banser Pengamanan Istighosah Kubro'
  }
];

export const mockUsaha: Usaha[] = [
  {
    id: 'u1',
    name: 'RSI MABARROT MWCNU BUNGAH',
    type: 'Jasa',
    location: 'Jl. Raya Masangan no. 1D',
    manager: 'MWC NU BUNGAH',
    status: 'Aktif',
    revenue: 900000000,
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'u2',
    name: 'KBIHU MWCNU Bungah',
    type: 'Jasa',
    location: 'Jl. Raya Bungah No. 63',
    manager: 'MWC NU BUNGAH',
    status: 'Aktif',
    revenue: 100000000,
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'u3',
    name: 'ST SCALA TECNIQUE JASA ENGINEERING',
    type: 'Jasa',
    location: 'DESA ABAR-ABIR, BUNGAH',
    manager: 'PRNU ABAR-ABIR',
    status: 'Aktif',
    revenue: 2500000000,
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'u4',
    name: 'PERTANIAN MANDIRI NU',
    type: 'Pertanian',
    location: 'DESA ABAR-ABIR',
    manager: 'PRNU ABAR-ABIR',
    status: 'Aktif',
    revenue: 100000000
  }
];

export const mockSaranaIbadah: SaranaIbadah[] = [
  {
    id: 'si1',
    name: 'MASJID BAITUL ABROR',
    type: 'Masjid',
    takmir: 'KH FATKHAN ANWARI, S.Ag.',
    imam1: 'KH FATKHAN ANWARI, S.Ag',
    imam2: 'FAIDIR ROHMAN, S.Ag.',
    nuAffiliation: 'Milik NU',
    landStatus: 'Wakaf NU',
    address: 'Desa Abar-Abir, Bungah, Gresik',
    rantingId: 'r1'
  },
  {
    id: 'si2',
    name: 'Masjid Baitul Muttaqin',
    type: 'Masjid',
    takmir: 'KH. Rofiqul Amin',
    imam1: 'H. Suyuti',
    imam2: 'H. Nur Halim',
    nuAffiliation: 'Milik NU',
    landStatus: 'Wakaf NU',
    address: 'PRNU Bedanten, Bungah',
    rantingId: 'r3'
  },
  {
    id: 'si3',
    name: 'Masjid Jami\' Kiai Gede',
    type: 'Masjid',
    takmir: 'Drs. K.H. M. Nawawi, M.Ag.',
    imam1: 'K.H. Masykuri Hasan',
    imam2: 'K.H. Ali Mustofa',
    nuAffiliation: 'Milik NU',
    landStatus: 'Wakaf NU',
    address: 'PRNU Bungah, Gresik',
    rantingId: 'r17'
  }
];

export const mockSaranaPendidikan: SaranaPendidikan[] = [
  {
    id: 'se1',
    name: 'KBMNU 47 AL ANWAR',
    level: 'TK/RA',
    status: 'Swasta NU',
    principal: 'SAYIDAH DIANA. S.Ag',
    studentCount: 50,
    phone: '81543445767',
    condition: 'Baik',
    address: 'PRNU ABAR-ABIR',
    rantingId: 'r1'
  },
  {
    id: 'se2',
    name: 'MI AL MA\'ARIF ABAR-ABIR',
    level: 'MI',
    status: 'Swasta NU',
    principal: 'SULISTIANAH',
    studentCount: 250,
    phone: '85745510965',
    condition: 'Baik',
    address: 'PRNU ABAR-ABIR',
    rantingId: 'r1'
  },
  {
    id: 'se3',
    name: 'RAM NU 67 WALISONGO ABAR ABIR',
    level: 'TK/RA',
    status: 'Swasta NU',
    principal: 'ZUNIA PUTRI',
    studentCount: 100,
    phone: '82143679494',
    condition: 'Baik',
    address: 'PRNU ABAR-ABIR',
    rantingId: 'r1'
  },
  {
    id: 'se4',
    name: 'PONPES AL ANWAR',
    level: 'Pesantren',
    status: 'Swasta NU',
    principal: 'KH FATKHAN ANWARI',
    studentCount: 200,
    phone: '81543445767',
    condition: 'Baik',
    address: 'PRNU ABAR-ABIR',
    rantingId: 'r1'
  },
  {
    id: 'se5',
    name: 'TK Muslimat NU Bedanten',
    level: 'TK/RA',
    status: 'Swasta NU',
    principal: 'Fatmawati',
    studentCount: 50,
    phone: '82140431811',
    condition: 'Baik',
    address: 'PRNU Bedanten, Bungah',
    rantingId: 'r3'
  },
  {
    id: 'se6',
    name: 'MI Mamba\'ul Ulum Bedanten',
    level: 'MI',
    status: 'Swasta NU',
    principal: 'Fahruddin,S.T',
    studentCount: 250,
    phone: '85257091745',
    condition: 'Baik',
    address: 'PRNU Bedanten, Bungah',
    rantingId: 'r3'
  },
  {
    id: 'se7',
    name: 'Madrasah Ibtidaiyah Ma’arif NU Assa’adah',
    level: 'MI',
    status: 'Swasta NU',
    principal: 'Ismail Marzuki',
    studentCount: 500,
    phone: '85219015554',
    condition: 'Baik',
    address: 'PRNU Bungah, Gresik',
    rantingId: 'r17'
  }
];

export const mockBerita: Berita[] = [
  {
    id: 'n1',
    title: 'Laporan Konsolidasi Database Integrasi Jamiyah MWC NU Bungah 2026',
    category: 'Warta Jamiyah',
    content: `
# Integrasi Data Terpadu MWC NU Bungah 2026

Bungah, Gresik — Pengurus Majelis Wakil Cabang Nahdlatul Ulama (MWC NU) Bungah mempublikasikan dokumen resmi konsolidasi database organisasi, aset, sarana, pembinaan, dan kelembagaan tahun akumulasi 2026.

## Langkah Strategis Kemandirian Organisasi
Ketua Tanfidziyah MWC NU Bungah menekankan pentingnya pengarsipan digital yang terpadu demi transparansi dana koin kemaslahatan, log persuratan yang tertib, serta perlindungan aset tanah wakaf NU.

> "Dengan adanya database integrasi ini, seluruh ranting dan banom se-Kecamatan Bungah dapat bersinergi secara optimal guna memajukan kemandirian umat baik di sektor sosial, pendidikan, maupun ekonomi."
    `,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    date: '2026-07-07',
    author: 'Admin MWC NU Bungah'
  }
];

export const mockDokumentasi: Dokumentasi[] = [
  { id: 'd1', title: 'Rapat Kerja Pengurus MWC NU Bungah', type: 'Foto', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', date: '2026-07-02', category: 'Rapat' },
  { id: 'd2', title: 'Penyaluran Koin Sehat RSNU Gresik', type: 'Foto', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80', date: '2026-06-25', category: 'Kegiatan' }
];

export const mockAspirasi: Aspirasi[] = [
  {
    id: 'as1',
    name: 'Ahmad Muzakki',
    phone: '085731110099',
    email: 'muzakki@gmail.com',
    rantingId: 'r1',
    subject: 'Pengadaan Paving Halaman TPQ',
    message: 'Kami dari pengurus TPQ memohon izin mengajukan stimulan dana koin S3 untuk perbaikan dan pemasangan paving halaman TPQ agar nyaman bagi santri saat musim hujan.',
    date: '2026-07-06',
    status: 'Masuk'
  }
];
