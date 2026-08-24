-- ====================================================================
-- MIGRATION: Membuat tabel RANTING di Supabase
-- Jalankan script ini di SQL Editor Supabase Dashboard Anda
-- ====================================================================

-- 1. Buat tabel ranting
CREATE TABLE IF NOT EXISTS public.ranting (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  village TEXT,
  established TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  active_banom JSONB DEFAULT '[]'::jsonb,
  active_lembaga JSONB DEFAULT '[]'::jsonb,
  sk_docs JSONB DEFAULT '[]'::jsonb,
  history TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan RLS
ALTER TABLE public.ranting ENABLE ROW LEVEL SECURITY;

-- 3. Buat polis akses (publik bisa baca, authenticated bisa tulis)
CREATE POLICY "Ranting dapat dilihat oleh publik secara transparan" 
  ON public.ranting FOR SELECT TO public USING (true);
CREATE POLICY "Ranting dapat dikelola oleh pengurus terautentikasi" 
  ON public.ranting FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Seed data: Insert semua 29 ranting + 1 MWC NU Bungah
-- Data diambil dari mockData.ts

INSERT INTO public.ranting (id, name, village, established, address, phone, email, image_url, active_banom, active_lembaga, sk_docs) VALUES
('mwc', 'MWC NU BUNGAH', 'Bungah', '1965-08-15', 'Gedung MWCNU Bungah, Jl. Raya Bungah No. 63, Bungah, Gresik', '087854116511', 'mwc@mwcnubungah.or.id', 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU","PMII","ISNU","JARTMAN","JQH","Pergunu","Sarbumusi","Pagar Nusa","Lesbumi"]'::jsonb,
 '["LDNU","LPMNU","RMI-NU","LKKNU","LTMNU","LAZISNU","LKNU","LAKPESDAM","LPBHNU","LPNU","LP2NU","LBMNU","LESBUMI","LTNNU","LPBI-NU","LF-NU","LWPNU"]'::jsonb,
 '[{"id":"sk-mwc-1","number":"124/A.II/04/2024","period":"2024-2029","fileUrl":"https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png","uploadDate":"2024-04-10","isLatest":true},{"id":"sk-mwc-2","number":"089/A.II/03/2019","period":"2019-2024","fileUrl":"https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png","uploadDate":"2019-03-25","isLatest":false}]'::jsonb),

('r1', 'PRNU ABAR ABIR', 'Abar Abir', '1970-03-12', 'Kantor PRNU Abar Abir, Desa Abar Abir, Kec. Bungah, Gresik', '081543445767', 'abarabir@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU","Pagar Nusa"]'::jsonb,
 '["LAZISNU","LTMNU","LPMNU","LWPNU"]'::jsonb,
 '[{"id":"sk-r1-1","number":"045/A.II/05/2025","period":"2025-2030","fileUrl":"https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png","uploadDate":"2025-05-12","isLatest":true}]'::jsonb),

('r2', 'PRNU MELIRANG', 'Melirang', '1972-11-05', 'Jl. Gua Melirang No. 45, Desa Melirang, Kec. Bungah, Gresik', '085731110099', 'melirang@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r3', 'PRNU BEDANTEN', 'Bedanten', '1975-01-20', 'Kantor PRNU Bedanten, Desa Bedanten, Kec. Bungah, Gresik', '081332570991', 'bedanten@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU","JQH"]'::jsonb,
 '["LAZISNU","LTMNU","LDNU"]'::jsonb,
 '[]'::jsonb),

('r4', 'PRNU PEGUNDAN', 'Pegundan', '1978-05-18', 'Jl. Raya Pegundan No. 12, Desa Pegundan, Kec. Bungah, Gresik', '085859666601', 'pegundan@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r5', 'PRNU SIDOKUMPUL', 'Sidokumpul', '1974-09-22', 'Desa Sidokumpul, Kec. Bungah, Gresik', '081234567801', 'sidokumpul@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r6', 'PRNU KISIK', 'Kisik', '1980-02-10', 'Jl. Demang Kisik, Desa Kisik, Kec. Bungah, Gresik', '081234567802', 'kisik@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r7', 'PRNU GROGOL', 'Grogol', '1982-06-14', 'Desa Grogol, Kec. Bungah, Gresik', '081234567803', 'grogol@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r8', 'PRNU MASANGAN', 'Masangan', '1979-04-30', 'Desa Masangan, Kec. Bungah, Gresik', '081234567804', 'masangan@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r9', 'PRNU LEBAKSARI', 'Lebaksari', '1985-08-11', 'Desa Lebaksari, Kec. Bungah, Gresik', '081234567805', 'lebaksari@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r10', 'PRNU SUNGONLEGOWO', 'Sungonlegowo', '1977-10-01', 'Jl. Raya Sungonlegowo, Desa Sungonlegowo, Kec. Bungah, Gresik', '081234567806', 'sungonlegowo@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r11', 'PRNU WATU AGUNG', 'Watu Agung', '1983-12-15', 'Desa Watu Agung, Kec. Bungah, Gresik', '081234567807', 'watuagung@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r12', 'PRNU MOJOPUROWETAN', 'Mojopuro Wetan', '1986-07-20', 'Desa Mojopuro Wetan, Kec. Bungah, Gresik', '081234567808', 'mojopurowetan@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r13', 'PRNU KEMANGI', 'Kemangi', '1984-05-25', 'Desa Kemangi, Kec. Bungah, Gresik', '081234567809', 'kemangi@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r14', 'PRNU KARANGLIMAN', 'Karangliman', '1987-11-03', 'Desa Karangliman, Kec. Bungah, Gresik', '081234567810', 'karangliman@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r15', 'PRNU MOJOPUROGEDE', 'Mojopurogede', '1981-01-14', 'Desa Mojopurogede, Kec. Bungah, Gresik', '081234567811', 'mojopurogede@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r16', 'PRNU PERENG KULON', 'Pereng Kulon', '1988-04-22', 'Desa Pereng Kulon, Kec. Bungah, Gresik', '081234567812', 'perengkulon@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r17', 'PRNU BUNGAH', 'Bungah', '1970-01-01', 'Jl. Kiai Gede, Desa Bungah, Kec. Bungah, Gresik', '081292928115', 'bungah@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU","Pagar Nusa"]'::jsonb,
 '["LAZISNU","LTMNU","LPMNU"]'::jsonb,
 '[]'::jsonb),

('r18', 'PRNU PERENG WETAN', 'Pereng Wetan', '1989-08-30', 'Desa Pereng Wetan, Kec. Bungah, Gresik', '081234567813', 'perengwetan@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r19', 'PRNU NGAREN', 'Ngaren', '1986-11-22', 'Desa Ngaren, Kec. Bungah, Gresik', '081234567823', 'ngaren@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r20', 'PRNU GUMENG', 'Gumeng', '1982-12-12', 'Desa Gumeng, Kec. Bungah, Gresik', '085859666601', 'gumeng@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r21', 'PRNU KRMAT', 'Kramat', '1985-06-15', 'Desa Kramat, Kec. Bungah, Gresik', '081234567814', 'kramat@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r22', 'PRNU TAJUNGWIDORO', 'Tajungwidoro', '1983-09-09', 'Mengare, Desa Tajungwidoro, Kec. Bungah, Gresik', '081234567815', 'tajungwidoro@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r23', 'PRNU SIDOMUKTI', 'Sidomukti', '1980-05-18', 'Mengare, Desa Sidomukti, Kec. Bungah, Gresik', '081234567816', 'sidomukti@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r24', 'PRNU SUKOWATI', 'Sukowati', '1984-11-11', 'Desa Sukowati, Kec. Bungah, Gresik', '081234567817', 'sukowati@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r25', 'PRNU RACI WETAN', 'Raci Wetan', '1986-02-28', 'Desa Raci Wetan, Kec. Bungah, Gresik', '081234567818', 'raciwetan@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r26', 'PRNU RACI DELANYAR', 'Raci Delanyar', '1988-07-07', 'Desa Raci Delanyar, Kec. Bungah, Gresik', '081234567819', 'racidelanyar@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1609599006353-e629f1d40e4f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r27', 'PRNU SIDOREJO', 'Sidorejo', '1981-12-25', 'Desa Sidorejo, Kec. Bungah, Gresik', '081234567820', 'sidorejo@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r28', 'PRNU SUKOREJO', 'Sukorejo', '1983-04-10', 'Desa Sukorejo, Kec. Bungah, Gresik', '081234567821', 'sukorejo@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb),

('r29', 'PRNU INDRODELIK', 'Indrodelik', '1985-08-11', 'Desa Indrodelik, Kec. Bungah, Gresik', '081234567822', 'indrodelik@mwcnubungah.or.id', 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
 '["Muslimat NU","GP Ansor","Fatayat NU","IPNU","IPPNU"]'::jsonb,
 '["LAZISNU","LTMNU"]'::jsonb,
 '[]'::jsonb)

ON CONFLICT (id) DO NOTHING;
