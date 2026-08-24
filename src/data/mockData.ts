import { rawKaderCsv } from './kaderCsv';
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
  { 
    id: 'mwc', 
    name: 'MWC NU BUNGAH', 
    village: 'Bungah', 
    established: '1965-08-15',
    address: 'Gedung MWCNU Bungah, Jl. Raya Bungah No. 63, Bungah, Gresik',
    phone: '087854116511',
    email: 'mwc@mwcnubungah.or.id',
    imageUrl: 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU', 'PMII', 'ISNU', 'JARTMAN', 'JQH', 'Pergunu', 'Sarbumusi', 'Pagar Nusa', 'Lesbumi'],
    activeLembaga: ['LDNU', 'LPMNU', 'RMI-NU', 'LKKNU', 'LTMNU', 'LAZISNU', 'LKNU', 'LAKPESDAM', 'LPBHNU', 'LPNU', 'LP2NU', 'LBMNU', 'LESBUMI', 'LTNNU', 'LPBI-NU', 'LF-NU', 'LWPNU'],
    skDocs: [
      {
        id: 'sk-mwc-1',
        number: '124/A.II/04/2024',
        period: '2024-2029',
        fileUrl: 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png',
        uploadDate: '2024-04-10',
        isLatest: true
      },
      {
        id: 'sk-mwc-2',
        number: '089/A.II/03/2019',
        period: '2019-2024',
        fileUrl: 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png',
        uploadDate: '2019-03-25',
        isLatest: false
      }
    ]
  },
  { 
    id: 'r1', 
    name: 'PRNU ABAR ABIR', 
    village: 'Abar Abir', 
    established: '1970-03-12',
    address: 'Kantor PRNU Abar Abir, Desa Abar Abir, Kec. Bungah, Gresik',
    phone: '081543445767',
    email: 'abarabir@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU', 'Pagar Nusa'],
    activeLembaga: ['LAZISNU', 'LTMNU', 'LPMNU', 'LWPNU'],
    skDocs: [
      {
        id: 'sk-r1-1',
        number: '045/A.II/05/2025',
        period: '2025-2030',
        fileUrl: 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png',
        uploadDate: '2025-05-12',
        isLatest: true
      }
    ]
  },
  { 
    id: 'r2', 
    name: 'PRNU MELIRANG', 
    village: 'Melirang', 
    established: '1972-11-05',
    address: 'Jl. Gua Melirang No. 45, Desa Melirang, Kec. Bungah, Gresik',
    phone: '085731110099',
    email: 'melirang@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r3', 
    name: 'PRNU BEDANTEN', 
    village: 'Bedanten', 
    established: '1975-01-20',
    address: 'Kantor PRNU Bedanten, Desa Bedanten, Kec. Bungah, Gresik',
    phone: '081332570991',
    email: 'bedanten@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU', 'JQH'],
    activeLembaga: ['LAZISNU', 'LTMNU', 'LDNU']
  },
  { 
    id: 'r4', 
    name: 'PRNU PEGUNDAN', 
    village: 'Pegundan', 
    established: '1978-05-18',
    address: 'Jl. Raya Pegundan No. 12, Desa Pegundan, Kec. Bungah, Gresik',
    phone: '085859666601',
    email: 'pegundan@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r5', 
    name: 'PRNU SIDOKUMPUL', 
    village: 'Sidokumpul', 
    established: '1974-09-22',
    address: 'Desa Sidokumpul, Kec. Bungah, Gresik',
    phone: '081234567801',
    email: 'sidokumpul@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r6', 
    name: 'PRNU KISIK', 
    village: 'Kisik', 
    established: '1980-02-10',
    address: 'Jl. Demang Kisik, Desa Kisik, Kec. Bungah, Gresik',
    phone: '081234567802',
    email: 'kisik@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r7', 
    name: 'PRNU GROGOL', 
    village: 'Grogol', 
    established: '1982-06-14',
    address: 'Desa Grogol, Kec. Bungah, Gresik',
    phone: '081234567803',
    email: 'grogol@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r8', 
    name: 'PRNU MASANGAN', 
    village: 'Masangan', 
    established: '1979-04-30',
    address: 'Desa Masangan, Kec. Bungah, Gresik',
    phone: '081234567804',
    email: 'masangan@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r9', 
    name: 'PRNU LEBAKSARI', 
    village: 'Lebaksari', 
    established: '1985-08-11',
    address: 'Desa Lebaksari, Kec. Bungah, Gresik',
    phone: '081234567805',
    email: 'lebaksari@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r10', 
    name: 'PRNU SUNGONLEGOWO', 
    village: 'Sungonlegowo', 
    established: '1977-10-01',
    address: 'Jl. Raya Sungonlegowo, Desa Sungonlegowo, Kec. Bungah, Gresik',
    phone: '081234567806',
    email: 'sungonlegowo@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r11', 
    name: 'PRNU WATU AGUNG', 
    village: 'Watu Agung', 
    established: '1983-12-15',
    address: 'Desa Watu Agung, Kec. Bungah, Gresik',
    phone: '081234567807',
    email: 'watuagung@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r12', 
    name: 'PRNU MOJOPUROWETAN', 
    village: 'Mojopuro Wetan', 
    established: '1986-07-20',
    address: 'Desa Mojopuro Wetan, Kec. Bungah, Gresik',
    phone: '081234567808',
    email: 'mojopurowetan@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r13', 
    name: 'PRNU KEMANGI', 
    village: 'Kemangi', 
    established: '1984-05-25',
    address: 'Desa Kemangi, Kec. Bungah, Gresik',
    phone: '081234567809',
    email: 'kemangi@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r14', 
    name: 'PRNU KARANGLIMAN', 
    village: 'Karangliman', 
    established: '1987-11-03',
    address: 'Desa Karangliman, Kec. Bungah, Gresik',
    phone: '081234567810',
    email: 'karangliman@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r15', 
    name: 'PRNU MOJOPUROGEDE', 
    village: 'Mojopurogede', 
    established: '1981-01-14',
    address: 'Desa Mojopurogede, Kec. Bungah, Gresik',
    phone: '081234567811',
    email: 'mojopurogede@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r16', 
    name: 'PRNU PERENG KULON', 
    village: 'Pereng Kulon', 
    established: '1988-04-22',
    address: 'Desa Pereng Kulon, Kec. Bungah, Gresik',
    phone: '081234567812',
    email: 'perengkulon@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r17', 
    name: 'PRNU BUNGAH', 
    village: 'Bungah', 
    established: '1970-01-01',
    address: 'Jl. Kiai Gede, Desa Bungah, Kec. Bungah, Gresik',
    phone: '081292928115',
    email: 'bungah@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU', 'Pagar Nusa'],
    activeLembaga: ['LAZISNU', 'LTMNU', 'LPMNU']
  },
  { 
    id: 'r18', 
    name: 'PRNU PERENG WETAN', 
    village: 'Pereng Wetan', 
    established: '1989-08-30',
    address: 'Desa Pereng Wetan, Kec. Bungah, Gresik',
    phone: '081234567813',
    email: 'perengwetan@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r19', 
    name: 'PRNU NGAREN', 
    village: 'Ngaren', 
    established: '1986-11-22',
    address: 'Desa Ngaren, Kec. Bungah, Gresik',
    phone: '081234567823',
    email: 'ngaren@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r20', 
    name: 'PRNU GUMENG', 
    village: 'Gumeng', 
    established: '1982-12-12',
    address: 'Desa Gumeng, Kec. Bungah, Gresik',
    phone: '085859666601',
    email: 'gumeng@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r21', 
    name: 'PRNU KRMAT', 
    village: 'Kramat', 
    established: '1985-06-15',
    address: 'Desa Kramat, Kec. Bungah, Gresik',
    phone: '081234567814',
    email: 'kramat@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r22', 
    name: 'PRNU TAJUNGWIDORO', 
    village: 'Tajungwidoro', 
    established: '1983-09-09',
    address: 'Mengare, Desa Tajungwidoro, Kec. Bungah, Gresik',
    phone: '081234567815',
    email: 'tajungwidoro@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r23', 
    name: 'PRNU SIDOMUKTI', 
    village: 'Sidomukti', 
    established: '1980-05-18',
    address: 'Mengare, Desa Sidomukti, Kec. Bungah, Gresik',
    phone: '081234567816',
    email: 'sidomukti@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r24', 
    name: 'PRNU SUKOWATI', 
    village: 'Sukowati', 
    established: '1984-11-11',
    address: 'Desa Sukowati, Kec. Bungah, Gresik',
    phone: '081234567817',
    email: 'sukowati@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r25', 
    name: 'PRNU RACI WETAN', 
    village: 'Raci Wetan', 
    established: '1986-02-28',
    address: 'Desa Raci Wetan, Kec. Bungah, Gresik',
    phone: '081234567818',
    email: 'raciwetan@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r26', 
    name: 'PRNU RACI DELANYAR', 
    village: 'Raci Delanyar', 
    established: '1988-07-07',
    address: 'Desa Raci Delanyar, Kec. Bungah, Gresik',
    phone: '081234567819',
    email: 'racidelanyar@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r27', 
    name: 'PRNU SIDOREJO', 
    village: 'Sidorejo', 
    established: '1981-12-25',
    address: 'Desa Sidorejo, Kec. Bungah, Gresik',
    phone: '081234567820',
    email: 'sidorejo@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r28', 
    name: 'PRNU SUKOREJO', 
    village: 'Sukorejo', 
    established: '1983-04-10',
    address: 'Desa Sukorejo, Kec. Bungah, Gresik',
    phone: '081234567821',
    email: 'sukorejo@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  },
  { 
    id: 'r29', 
    name: 'PRNU INDRODELIK', 
    village: 'Indrodelik', 
    established: '1985-08-11',
    address: 'Desa Indrodelik, Kec. Bungah, Gresik',
    phone: '081234567822',
    email: 'indrodelik@mwcnubungah.or.id',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    activeBanom: ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU'],
    activeLembaga: ['LAZISNU', 'LTMNU']
  }
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
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    groupType: 'Harian'
  },
  {
    id: 'p2',
    name: "KH. Muhammad Ala'uddin, LC, M.SEI",
    role: 'Tanfidziyah (Ketua)',
    category: 'MWC',
    phone: '087854116511',
    kaderisasiStatus: 'MKNU',
    education: 'S2',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    groupType: 'Harian'
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
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    groupType: 'Harian'
  },
  {
    id: 'p4',
    name: 'MUHAMMAD YASIN, ST',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r1',
    phone: '082132317474',
    kaderisasiStatus: 'BELUM',
    education: 'S1',
    groupType: 'Harian'
  },
  {
    id: 'p15',
    name: 'Akhmad Fauzi',
    role: 'Ketua Ranting GP Ansor',
    category: 'Ranting',
    rantingId: 'r1',
    phone: '081234567801',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1',
    groupType: 'Banom',
    groupName: 'GP Ansor'
  },
  {
    id: 'p16',
    name: 'Siti Aminah, S.Pd.',
    role: 'Ketua Ranting Fatayat NU',
    category: 'Ranting',
    rantingId: 'r1',
    phone: '081234567802',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1',
    groupType: 'Banom',
    groupName: 'Fatayat NU'
  },
  {
    id: 'p17',
    name: 'H. Abdul Wahab, SE',
    role: 'Ketua UPZIS LAZISNU',
    category: 'Ranting',
    rantingId: 'r1',
    phone: '081234567803',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1',
    groupType: 'Lembaga',
    groupName: 'LAZISNU'
  },
  // PRNU BEDANTEN
  {
    id: 'p5',
    name: 'KH. Rofiqul Amin, S.Pd.',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r3',
    phone: '081332570991',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1',
    groupType: 'Harian'
  },
  {
    id: 'p6',
    name: 'Syukri Ghozali, S.Pd.',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r3',
    phone: '081357334667',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1',
    groupType: 'Harian'
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
    education: 'S1',
    groupType: 'Harian'
  },
  {
    id: 'p8',
    name: 'Hamdi Ahmadi Mushzabi, M.Pd.',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r17',
    phone: '081292928115',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S2',
    groupType: 'Harian'
  },
  {
    id: 'p18',
    name: "Muhammad Syafi'i, S.Kom.",
    role: 'Ketua Ranting GP Ansor',
    category: 'Ranting',
    rantingId: 'r17',
    phone: '081292928001',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1',
    groupType: 'Banom',
    groupName: 'GP Ansor'
  },
  {
    id: 'p19',
    name: 'Hj. Ummu Kulsum',
    role: 'Ketua Ranting Muslimat NU',
    category: 'Ranting',
    rantingId: 'r17',
    phone: '081292928002',
    kaderisasiStatus: 'Penyetaraan',
    education: 'SMA',
    groupType: 'Banom',
    groupName: 'Muslimat NU'
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
    education: 'S1',
    groupType: 'Harian'
  },
  {
    id: 'p10',
    name: 'Muzhafir, S.Ag.',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r7',
    phone: '085733884382',
    kaderisasiStatus: 'BELUM',
    education: 'S1',
    groupType: 'Harian'
  },
  // PRNU GUMENG
  {
    id: 'p11',
    name: 'H. MUDHOFFAR',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r20',
    phone: '08557048248',
    kaderisasiStatus: 'BELUM',
    education: 'Pesantren',
    groupType: 'Harian'
  },
  {
    id: 'p12',
    name: 'AHMAD SYAUQI THOHA',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r20',
    phone: '085804485256',
    kaderisasiStatus: 'BELUM',
    education: 'S1',
    groupType: 'Harian'
  },
  // PRNU INDRODELIK
  {
    id: 'p13',
    name: 'Ali Murtadlo S.Pd.i',
    role: 'Rois Syuriyah',
    category: 'Ranting',
    rantingId: 'r29',
    phone: '085102643003',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S1',
    groupType: 'Harian'
  },
  {
    id: 'p14',
    name: 'Drs. H. Ahmad Djamil M.Pd',
    role: 'Tanfidziyah',
    category: 'Ranting',
    rantingId: 'r29',
    phone: '085748839722',
    kaderisasiStatus: 'PD-PKPNU',
    education: 'S2',
    groupType: 'Harian'
  }
];

// Helper to parse CSV properly (taking double quotes with commas into account)
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Convert month name to two digit string
export function getMonthNumber(month: string): string {
  const m = month.toUpperCase().trim();
  if (m.startsWith('JAN')) return '01';
  if (m.startsWith('FEB')) return '02';
  if (m.startsWith('MAR')) return '03';
  if (m.startsWith('APR')) return '04';
  if (m.startsWith('MEI') || m.startsWith('MAY')) return '05';
  if (m.startsWith('JUN')) return '06';
  if (m.startsWith('JUL')) return '07';
  if (m.startsWith('AGU')) return '08';
  if (m.startsWith('SEP')) return '09';
  if (m.startsWith('OKT') || m.startsWith('OCT')) return '10';
  if (m.startsWith('NOV')) return '11';
  if (m.startsWith('DES') || m.startsWith('DEC')) return '12';
  return '01';
}

// Map RANTING column to rantingId
export function mapRantingToId(rantingName: string): string {
  const name = rantingName.toUpperCase().replace(/[-_]/g, ' ').trim();
  if (name.includes('ABAR')) return 'r1';
  if (name.includes('MELIRANG')) return 'r2';
  if (name.includes('BEDANTEN')) return 'r3';
  if (name.includes('PEGUNDAN')) return 'r4';
  if (name.includes('SIDOKUMPUL')) return 'r5';
  if (name.includes('KISIK')) return 'r6';
  if (name.includes('GROGOL')) return 'r7';
  if (name.includes('MASANGAN')) return 'r8';
  if (name.includes('LEBAK')) return 'r9';
  if (name.includes('SUNGONLEGOWO') || name.includes('SUNGON LEGOWO')) return 'r10';
  if (name.includes('WATUAGUNG') || name.includes('WATU AGUNG')) return 'r11';
  if (name.includes('MOJOPURO WETAN') || name.includes('MOJOPUROWETAN')) return 'r12';
  if (name.includes('MOJOPUROGEDE') || name.includes('MOJOPURO GEDE')) return 'r15';
  if (name.includes('BUNGAH')) return 'r17';
  if (name.includes('KRAMAT')) return 'r20';
  if (name.includes('TAJUNGWIDORO') || name.includes('TAJUNG WIDORO')) return 'r21';
  if (name.includes('SIDOMUKTI')) return 'r22';
  if (name.includes('SUKOWATI')) return 'r23';
  if (name.includes('RACI WETAN')) return 'r24';
  if (name.includes('RACI DELANYAR')) return 'r25';
  if (name.includes('SIDOREJO')) return 'r26';
  if (name.includes('SUKOREJO')) return 'r27';
  if (name.includes('INDRODELIK')) return 'r28';
  return 'mwc'; // fallback to MWC NU BUNGAH
}

// Map UNSUR to Banom type
export function mapUnsurToBanom(unsur: string): 'IPNU' | 'IPPNU' | 'Ansor' | 'Fatayat' | 'Muslimat' | 'Banser' | 'Pagar Nusa' | 'Lainnya' {
  const u = unsur.toUpperCase().trim();
  if (u.includes('IPPNU')) return 'IPPNU';
  if (u.includes('IPNU')) return 'IPNU';
  if (u.includes('ANSOR') || u.includes('ANSHOR')) return 'Ansor';
  if (u.includes('FATAYAT')) return 'Fatayat';
  if (u.includes('MUSLIMAT')) return 'Muslimat';
  if (u.includes('BANSER')) return 'Banser';
  if (u.includes('PAGAR NUSA') || u.includes('PAGAR_NUSA')) return 'Pagar Nusa';
  return 'Lainnya';
}

// Map Roman numeral generation to a year
export function mapAngkatanToYear(angkatan: string): number {
  const a = angkatan.toUpperCase().trim();
  if (a === 'II') return 2016;
  if (a === 'III') return 2017;
  if (a === 'V') return 2018;
  if (a === 'VI') return 2018;
  if (a === 'IX') return 2019;
  if (a === 'XIX') return 2019;
  if (a === 'XVIII') return 2019;
  if (a === 'XX') return 2020;
  if (a === 'XXIII') return 2021;
  if (a === 'XXVII') return 2022;
  if (a === 'XXX') return 2023;
  if (a === 'XXXV') return 2024;
  if (a === 'XXXVI') return 2024;
  if (a === 'XXXVIII') return 2024;
  if (a === 'XL') return 2025;
  if (a === 'XLI') return 2025;
  if (a === 'XLIII') return 2025;
  if (a === 'XLIV') return 2025;
  if (a === 'XLV') return 2026;
  return 2024; // default
}

// Map birth column (e.g. "GRESIK, 10 JULI 1972" or "GRESIK, 21-10-1978")
export function parseBirth(birthCol: string): { pob: string; dob: string } {
  if (!birthCol) return { pob: '-', dob: '1980-01-01' };
  const parts = birthCol.split(',');
  const pob = parts[0] ? parts[0].trim() : '-';
  const dobRaw = parts[1] ? parts[1].trim() : '';

  let dob = '1980-01-01';
  if (dobRaw) {
    // Check if it's like "21-10-1978"
    if (dobRaw.includes('-')) {
      const dParts = dobRaw.split('-');
      if (dParts.length === 3) {
        // usually DD-MM-YYYY
        const day = dParts[0].padStart(2, '0');
        const month = dParts[1].padStart(2, '0');
        const year = dParts[2];
        dob = `${year}-${month}-${day}`;
      }
    } else {
      // It's like "10 JULI 1972"
      const dParts = dobRaw.trim().split(/\s+/);
      if (dParts.length === 3) {
        const day = dParts[0].padStart(2, '0');
        const monthStr = dParts[1];
        const year = dParts[2];
        const monthNum = getMonthNumber(monthStr);
        dob = `${year}-${monthNum}-${day}`;
      }
    }
  }
  return { pob, dob };
}

function generateKadersFromCSV(): Kader[] {
  const lines = rawKaderCsv.split('\n');
  const kaders: Kader[] = [];

  // Load only the first 5 entries to keep the default client database clean and fast
  const maxInitial = Math.min(6, lines.length);

  for (let i = 1; i < maxInitial; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const row = parseCSVLine(line);
    if (row.length < 11) continue;

    const no = row[0];
    const nama = row[1];
    const birthCol = row[2];
    const unsur = row[3];
    const jabatan = row[4];
    const alamat = row[5];
    const ranting = row[6];
    const noTelp = row[7];
    const jk = row[8];
    const mwcNu = row[9];
    const angkatan = row[10];

    const { pob, dob } = parseBirth(birthCol);
    const gender = jk.toUpperCase() === 'P' ? 'Perempuan' : 'Laki-laki';
    const banom = mapUnsurToBanom(unsur);
    const role = (jabatan && jabatan !== '-') ? jabatan : (unsur || 'Kader');
    const rantingId = mapRantingToId(ranting);
    const phone = noTelp === '-' ? '' : (noTelp.startsWith('8') ? '0' + noTelp : noTelp);
    const joinYear = mapAngkatanToYear(angkatan);

    kaders.push({
      id: 'k' + no,
      name: nama,
      pob,
      dob,
      gender,
      banom,
      role,
      rantingId,
      phone,
      joinYear,
      unsur,
      address: alamat,
      angkatan
    });
  }

  return kaders;
}

export const mockKader: Kader[] = generateKadersFromCSV();

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

// ====================================================================
// URL SLUG HELPERS: Convert ranting name <-> URL-friendly slug
// ====================================================================

/** Convert a ranting name to a URL-friendly slug. e.g. "PRNU Bungah" → "ranting-bungah", "MWC NU BUNGAH" → "mwc" */
export function rantingNameToSlug(name: string): string {
  const n = name.toUpperCase().trim();
  if (n.includes('MWC')) return 'mwc';
  // Strip PRNU prefix
  const stripped = n.replace(/^PRNU\s+/i, '').trim();
  return 'ranting-' + stripped
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Convert a URL slug back to a ranting ID by matching against rantings list.
 *  e.g. "ranting-bungah" → "r17", "mwc" → "mwc" */
export function slugToRantingId(slug: string, rantings: { id: string; name: string }[]): string {
  const s = slug.toLowerCase().trim();
  if (s === 'mwc') return 'mwc';
  // Try to match by converting each ranting name to slug
  for (const r of rantings) {
    if (rantingNameToSlug(r.name) === s) return r.id;
  }
  // Fallback: try direct ID match
  const directMatch = rantings.find(r => r.id === s);
  if (directMatch) return s;
  return slug; // Return as-is if no match
}
